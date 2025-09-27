import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock, Shield } from "lucide-react";

interface VerificationStatusProps {
  userData: {
    role: string;
    aadhaarVerified?: boolean;
    adminApproved?: boolean;
    verificationStatus?: string;
  };
  className?: string;
}

const VerificationStatus = ({ userData, className = "" }: VerificationStatusProps) => {
  const getStatusInfo = () => {
    const { role, aadhaarVerified, adminApproved, verificationStatus } = userData;

    if (role === 'admin') {
      return {
        icon: adminApproved ? CheckCircle : Clock,
        label: adminApproved ? 'Admin Approved' : 'Pending Admin Approval',
        badge: adminApproved ? 'verified' : 'pending',
        description: adminApproved 
          ? 'Your admin account is fully verified and active.'
          : 'Your admin account is awaiting approval from senior officials. Some features may be limited.',
        bgColor: adminApproved ? 'bg-green-50' : 'bg-yellow-50',
        borderColor: adminApproved ? 'border-green-200' : 'border-yellow-200'
      };
    } else {
      // For farmers and landowners (both use Aadhaar)
      return {
        icon: aadhaarVerified ? CheckCircle : AlertCircle,
        label: aadhaarVerified ? 'Aadhaar Verified' : 'Aadhaar Verification Pending',
        badge: aadhaarVerified ? 'verified' : 'pending',
        description: aadhaarVerified
          ? 'Your identity is verified. You have full access to platform features.'
          : role === 'farmer' 
            ? 'Complete your Aadhaar verification to access all farming features and land rental opportunities.'
            : 'Complete your Aadhaar verification to list your properties and connect with verified farmers.',
        bgColor: aadhaarVerified ? 'bg-green-50' : 'bg-yellow-50',
        borderColor: aadhaarVerified ? 'border-green-200' : 'border-yellow-200'
      };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  return (
    <div className={`p-4 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor} ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          {userData.role === 'admin' ? (
            <Shield className="h-5 w-5 text-primary" />
          ) : userData.role === 'farmer' ? (
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
          ) : (
            <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
            </div>
          )}
          <span className="font-medium">Account Status:</span>
        </div>
        
        {statusInfo.badge === 'verified' ? (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Icon className="h-3 w-3 mr-1" />
            {statusInfo.label}
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
            <Icon className="h-3 w-3 mr-1" />
            {statusInfo.label}
          </Badge>
        )}
      </div>
      
      {statusInfo.badge === 'pending' && (
        <p className="text-xs text-muted-foreground mt-2">
          {statusInfo.description}
        </p>
      )}
    </div>
  );
};

export default VerificationStatus;