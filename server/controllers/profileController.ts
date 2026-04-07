import { Request, Response } from 'express';
import Profile from '../models/Profile.ts';

export const getProfile = async (req: Request, res: Response) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    let profile = await Profile.findOne();
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.__v;

    if (!profile) {
      profile = await Profile.create(updateData);
    } else {
      profile = await Profile.findByIdAndUpdate(profile._id, updateData, { new: true });
    }
    res.json(profile);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
