import { prisma } from '@/prisma/client';

export class PropertyExploreService {
  async getPropertyDetail(
    propertyId: number,
    startDate?: Date,
    endDate?: Date,
    days: Date[] = [],
  ) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId, deletedAt: null },
      include: {
        city: true,
        category: true,
        PropertyImages: true,
        rooms: {
          where: { deletedAt: null },
          include: {
            availabilities:
              days.length > 0
                ? {
                    where: {
                      date: {
                        in: days,
                      },
                    },
                  }
                : false,
            peakRates: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                profilePhoto: true,
              },
            },
          },
        },
      },
    });

    if (!property) {
      throw new Error('Property not found');
    }

    const rooms = property.rooms.map((room) => {
      // Hitung totalAvailable
      let totalAvailable = room.qty;
      if (days.length > 0) {
        const availableEachDay = days.map((day) => {
          const availability = room.availabilities?.find((a) => {
            const aDate = a.date.toISOString().slice(0, 10);
            const d = day.toISOString().slice(0, 10);
            return aDate === d;
          });
          return availability ? availability.available : room.qty;
        });

        totalAvailable = Math.min(...availableEachDay);
      }

      // Hitung effectivePrice
      const firstDay = days[0];
      let price = room.basePrice;
      const peak = room.peakRates.find(
        (rate) => firstDay >= rate.startDate && firstDay <= rate.endDate,
      );

      if (peak) {
        price +=
          peak.priceModifierType === 'PERCENTAGE'
            ? (price * peak.priceModifierValue) / 100
            : peak.priceModifierValue;
      }

      const effectivePrice = Math.round(price);

      return {
        id: room.id,
        name: room.name,
        image: room.image,
        description: room.description,
        capacity: room.capacity,
        totalAvailable,
        effectivePrice,
      };
    });

    return {
      id: property.id,
      name: property.name,
      image: property.image,
      address: property.address,
      description: property.description,
      city: property.city.name,
      category: property.category.name,
      propertyImages: property.PropertyImages.map((img) => img.url),
      rooms,
      reviews: property.reviews.map((review) => ({
        id: review.id,
        comment: review.comment,
        rating: review.rating,
        photo: review.user.profilePhoto || '/default-avatar.jpg',
        name: review.user?.name,
        createdAt: review.createdAt,
      })),
    };
  }

  async getRoomsByPropertyId(
    propertyId: number,
    startDate?: Date,
    endDate?: Date,
    days: Date[] = [],
  ) {
    const rooms = await prisma.room.findMany({
      where: {
        propertyId,
        deletedAt: null,
      },
      include: {
        availabilities:
          days.length > 0
            ? {
                where: {
                  date: {
                    in: days,
                  },
                },
              }
            : false,
        peakRates: true,
      },
    });

    return rooms.map((room) => {
      // Hitung totalAvailable
      let totalAvailable = room.qty;
      if (days.length > 0) {
        const availableEachDay = days.map((day) => {
          const availability = room.availabilities?.find((a) => {
            const aDate = a.date.toISOString().slice(0, 10);
            const d = day.toISOString().slice(0, 10);
            return aDate === d;
          });
          return availability ? availability.available : room.qty;
        });

        totalAvailable = Math.min(...availableEachDay);
      }

      // Hitung effectivePrice (rata-rata jika ada peakRate)
      let totalPrice = 0;
      if (days.length > 0) {
        for (const day of days) {
          const peak = room.peakRates.find(
            (rate) => day >= rate.startDate && day <= rate.endDate,
          );

          let price = room.basePrice;
          if (peak) {
            if (peak.priceModifierType === 'PERCENTAGE') {
              price += (price * peak.priceModifierValue) / 100;
            } else if (peak.priceModifierType === 'NOMINAL') {
              price += peak.priceModifierValue;
            }
          }

          totalPrice += price;
        }
      } else {
        totalPrice = room.basePrice;
      }

      const effectivePrice =
        days.length > 0 ? Math.round(totalPrice / days.length) : room.basePrice;

      return {
        id: room.id,
        name: room.name,
        image: room.image,
        description: room.description,
        capacity: room.capacity,
        totalAvailable,
        effectivePrice,
      };
    });
  }

  async getRoomPricesByMonth(propertyId: number, month: string) {
    const [year, monthIndex] = month.split('-').map(Number);
    const start = new Date(year, monthIndex - 1, 1);
    const end = new Date(year, monthIndex, 0);

    const days: Date[] = [];
    const current = new Date(start);
    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    const rooms = await prisma.room.findMany({
      where: { propertyId, deletedAt: null },
      include: {
        peakRates: true,
      },
    });

    const dailyPrices: { date: string; price: number }[] = days.map((day) => {
      let minPrice = Infinity;

      for (const room of rooms) {
        let price = room.basePrice;
        const normalize = (date: Date) => date.toISOString().slice(0, 10);

        const peak = room.peakRates.find((rate) => {
          const dayStr = normalize(day);
          const startStr = normalize(rate.startDate);
          const endStr = normalize(rate.endDate);
          return dayStr >= startStr && dayStr <= endStr;
        });

        if (peak) {
          if (peak.priceModifierType === 'PERCENTAGE') {
            price += (price * peak.priceModifierValue) / 100;
          } else if (peak.priceModifierType === 'NOMINAL') {
            price += peak.priceModifierValue;
          }
        }

        if (price < minPrice) minPrice = price;
      }

      return {
        date: day.toISOString().slice(0, 10),
        price: Math.round(minPrice),
      };
    });

    return dailyPrices;
  }

  async getRoomPricesTwoMonths(propertyId: number) {
    const today = new Date();

    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);

    const days: Date[] = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    const rooms = await prisma.room.findMany({
      where: { propertyId, deletedAt: null },
      include: { peakRates: true },
    });

    const dailyPrices = days.map((day) => {
      let minPrice = Infinity;

      for (const room of rooms) {
        let price = room.basePrice;
        const d = day.toISOString().slice(0, 10);

        const peak = room.peakRates.find((rate) => {
          const s = rate.startDate.toISOString().slice(0, 10);
          const e = rate.endDate.toISOString().slice(0, 10);
          return s <= d && d <= e;
        });

        if (peak) {
          if (peak.priceModifierType === 'PERCENTAGE') {
            price += (price * peak.priceModifierValue) / 100;
          } else {
            price += peak.priceModifierValue;
          }
        }

        if (price < minPrice) minPrice = price;
      }

      return {
        date: day.toISOString().slice(0, 10),
        price: Math.round(minPrice),
      };
    });

    return dailyPrices;
  }
}
