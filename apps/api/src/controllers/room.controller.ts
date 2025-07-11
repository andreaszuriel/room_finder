import { Request, Response } from 'express';
import { RoomService } from '@/services/room.service';

export class RoomController {
  private roomService: RoomService;

  constructor() {
    this.roomService = new RoomService();
  }

  async createRoom(req: Request, res: Response) {
    try {
      const tenant = (req as any).user;

      if (!tenant || tenant.role !== 'TENANT') {
        return res
          .status(403)
          .json({ message: 'Forbidden: Only tenants can create rooms' });
      }

      const propertyId = Number(req.params.propertyId);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: 'Invalid property ID' });
      }

      const { name, description, qty, basePrice, capacity } = req.body;
      const image = req.file;

      if (!image) {
        return res.status(400).json({ message: 'Room image is required' });
      }

      const room = await this.roomService.createRoom(
        tenant.userId,
        propertyId,
        {
          name,
          description,
          qty: Number(qty),
          basePrice: Number(basePrice),
          capacity: Number(capacity),
        },
        image,
      );

      return res.status(201).json({
        message: 'Room created successfully',
        data: room,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async updateRoom(req: Request, res: Response) {
    try {
      const tenant = (req as any).user;
      if (!tenant || tenant.role !== 'TENANT') {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const propertyId = Number(req.params.propertyId);
      const roomId = Number(req.params.id);
      if (isNaN(propertyId) || isNaN(roomId)) {
        return res.status(400).json({ message: 'Invalid property or room ID' });
      }

      const { name, description, qty, basePrice, capacity } = req.body;
      const image = req.file;

      const updatedRoom = await this.roomService.updateRoom(
        roomId,
        tenant.userId,
        {
          name,
          description,
          qty: qty ? Number(qty) : undefined,
          basePrice: basePrice ? Number(basePrice) : undefined,
          capacity: capacity ? Number(capacity) : undefined,
        },
        image,
      );

      return res
        .status(200)
        .json({ message: 'Room updated successfully', data: updatedRoom });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async softDeleteRoom(req: Request, res: Response) {
    try {
      const tenant = (req as any).user;
      if (!tenant || tenant.role !== 'TENANT') {
        return res
          .status(403)
          .json({ message: 'Forbidden: Only tenants can delete rooms' });
      }

      const propertyId = Number(req.params.propertyId);
      const roomId = Number(req.params.id);
      if (isNaN(propertyId) || isNaN(roomId)) {
        return res.status(400).json({ message: 'Invalid property or room ID' });
      }

      const result = await this.roomService.softDeleteRoom(
        roomId,
        tenant.userId,
      );
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async hardDeleteRoom(req: Request, res: Response) {
    try {
      const tenant = (req as any).user;
      if (!tenant || tenant.role !== 'TENANT') {
        return res
          .status(403)
          .json({ message: 'Forbidden: Only tenants can delete rooms' });
      }

      const propertyId = Number(req.params.propertyId);
      const roomId = Number(req.params.id);
      if (isNaN(propertyId) || isNaN(roomId)) {
        return res.status(400).json({ message: 'Invalid property or room ID' });
      }

      const result = await this.roomService.hardDeleteRoom(
        roomId,
        tenant.userId,
      );

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async restoreRoom(req: Request, res: Response) {
    try {
      const tenant = (req as any).user;
      if (!tenant || tenant.role !== 'TENANT') {
        return res.status(403).json({
          message: 'Forbidden: Only tenants can restore properties',
        });
      }

      const propertyId = Number(req.params.propertyId);
      const roomId = Number(req.params.id);
      if (isNaN(propertyId) || isNaN(roomId)) {
        return res.status(400).json({ message: 'Invalid property or room ID' });
      }

      const result = await this.roomService.restoreRoom(roomId, tenant.userId);

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async getTenantRooms(req: Request, res: Response) {
    try {
      const tenant = (req as any).user;
      if (!tenant || tenant.role !== 'TENANT') {
        return res
          .status(403)
          .json({ message: 'Forbidden: Only tenants can view this data' });
      }

      const rooms = await this.roomService.getTenantRoom(tenant.userId);

      return res.status(200).json({
        message: 'Rooms fetched successfully',
        data: rooms,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async getRoomsByProperty(req: Request, res: Response) {
    try {
      const tenant = (req as any).user;

      if (!tenant || tenant.role !== 'TENANT') {
        return res.status(403).json({
          message: 'Forbidden: Only tenants can view this data',
        });
      }

      const propertyId = Number(req.params.propertyId);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: 'Invalid property ID' });
      }

      const rooms = await this.roomService.getRoomsByProperty(
        propertyId,
        tenant.userId,
      );

      return res.status(200).json({
        message: 'Rooms fetched successfully',
        data: rooms,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async getRoomById(req: Request, res: Response) {
    try {
      const tenant = (req as any).user;
      if (!tenant || tenant.role !== 'TENANT') {
        return res
          .status(403)
          .json({ message: 'Forbidden: Only tenants can access this' });
      }

      const roomId = Number(req.params.roomId);
      if (isNaN(roomId)) {
        return res.status(400).json({ message: 'Invalid room ID' });
      }

      const room = await this.roomService.getRoomById(roomId, tenant.userId);

      return res.status(200).json({
        message: 'Room fetched successfully',
        data: room,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  //public
  async getPublicRoomById(req: Request, res: Response) {
    try {
      const roomId = Number(req.params.roomId);
      if (isNaN(roomId)) {
        return res.status(400).json({ message: 'Invalid room ID' });
      }

      const room = await this.roomService.getPublicRoomById(roomId);
      return res.status(200).json({
        message: 'Room fetched successfully',
        data: room,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
}
