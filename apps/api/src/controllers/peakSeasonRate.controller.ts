import { Request, Response } from 'express';
import { PeakSeasonRateService } from '@/services/peakSeasonRate.service';

export class PeakSeasonRateController {
  private peakSeasonRateService: PeakSeasonRateService;

  constructor() {
    this.peakSeasonRateService = new PeakSeasonRateService();
  }

  async setPeakSeasonRate(req: Request, res: Response) {
    try {
      const tenant = (req as any).user;
      if (!tenant || tenant.role !== 'TENANT') {
        return res.status(403).json({
          message: 'Forbidden: Only tenants can set peak season rates',
        });
      }

      const roomId = Number(req.params.roomId);
      if (isNaN(roomId)) {
        return res.status(400).json({ message: 'Invalid room ID' });
      }

      const { startDate, endDate, priceModifierType, priceModifierValue } =
        req.body;

      if (
        !startDate ||
        !endDate ||
        !priceModifierType ||
        priceModifierValue === undefined
      ) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const result = await this.peakSeasonRateService.setPeakSeasonRate(
        tenant.userId,
        roomId,
        new Date(startDate),
        new Date(endDate),
        priceModifierType,
        Number(priceModifierValue),
      );

      return res
        .status(201)
        .json({ message: 'Peak season rate set', data: result });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async getPeakSeasonsByRoomId(req: Request, res: Response) {
    try {
      const tenant = (req as any).user;
      if (!tenant || tenant.role !== 'TENANT') {
        return res
          .status(403)
          .json({ message: 'Forbidden: Only tenants can view this data' });
      }

      const roomId = Number(req.params.roomId);
      if (isNaN(roomId)) {
        return res.status(400).json({ message: 'Invalid room ID' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const peakSeasons =
        await this.peakSeasonRateService.getPeakSeasonsByRoomId(
          roomId,
          tenant.userId,
          page,
          limit,
        );

      return res.status(200).json({
        message: 'Peak seasons fetched successfully',
        ...peakSeasons,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
}
