import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminAuditLog extends Document {
  adminUser: mongoose.Types.ObjectId;
  action: string;
  entityType: string;
  entityId: string;
  beforeState?: any;
  afterState?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const AdminAuditLogSchema = new Schema<IAdminAuditLog>(
  {
    adminUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { type: String, required: true, index: true },
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    beforeState: { type: Schema.Types.Mixed },
    afterState: { type: Schema.Types.Mixed },
    ipAddress: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

AdminAuditLogSchema.index({ entityType: 1, entityId: 1 });

export const AdminAuditLog = mongoose.model<IAdminAuditLog>('AdminAuditLog', AdminAuditLogSchema);
