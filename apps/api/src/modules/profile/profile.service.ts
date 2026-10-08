import { StudentProfile } from '../../models/StudentProfile';
import { User } from '../../models/User';
import { NotFoundError } from '../../common/errors/AppError';
import { ReadinessScoringService } from '../readiness/readiness.service';
import { UpdateProfileInput } from '@placementos/shared';

export class ProfileService {
  static async getProfile(userId: string) {
    const profile = await StudentProfile.findOne({ user: userId });
    const user = await User.findById(userId).select('-passwordHash -refreshTokens');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role
      },
      profile
    };
  }

  static async updateProfile(userId: string, input: UpdateProfileInput) {
    let profile = await StudentProfile.findOne({ user: userId });
    if (!profile) {
      throw new NotFoundError('Student profile not found');
    }

    if (input.placementDeadline) {
      profile.placementDeadline = new Date(input.placementDeadline);
    }

    Object.assign(profile, input);
    await profile.save();

    // If target role or skills changed, trigger readiness recalculation
    const readiness = await ReadinessScoringService.calculateAndSaveReadiness(
      userId,
      'manual_recalculate'
    );

    return {
      profile,
      readiness
    };
  }
}
