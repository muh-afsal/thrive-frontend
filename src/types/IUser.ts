

export interface UserDataPayload {
    _id?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    role?: string; 
    isBlocked?: boolean; 
    phone?: string;
    bio?: string;
    address?: string;
    profession?: string;
    profileImage?: string;
    subscription?: Array<{
      paymentStatus: "pending" | "paid";
      expiration?: Date;
      planType?: string;
      isActive?: boolean; 
    }>;
    transactions?: Array<{
      transactionType: "credit" | "debit";
      message?: string;
      date?: Date;
      amount?: number;
      transactionID?: string;
    }>;
    createdAt?: Date;
    updatedAt?: Date;
  }
  