"use server";

import { Query } from "node-appwrite";
import { createAdminClient } from "../appwrite/server";
import { ReferralCode } from "../domains/referral_codes.domain";

// Database information
const DATABASE_ID = "Core";
const REFERRAL_CODES_COLLECTION_ID = "ReferralCodes";

// Create a new referral code
export async function createReferralCode(
  referralCode: Omit<ReferralCode, "$id">
) {
  try {
    const { databases } = await createAdminClient();

    const newReferralCode = await databases.createDocument(
      DATABASE_ID,
      REFERRAL_CODES_COLLECTION_ID,
      "unique()",
      {
        code: referralCode.code,
      }
    );

    return {
      success: true,
      data: newReferralCode,
    };
  } catch (error) {
    console.error("Error creating referral code:", error);
    return {
      success: false,
      error: "Failed to create referral code",
    };
  }
}

// Get a specific referral code by ID
export async function getReferralCode(referralCodeId: string) {
  try {
    const { databases } = await createAdminClient();

    const referralCode = await databases.getDocument(
      DATABASE_ID,
      REFERRAL_CODES_COLLECTION_ID,
      referralCodeId
    );

    return {
      success: true,
      data: referralCode,
    };
  } catch (error) {
    console.error("Error fetching referral code:", error);
    return {
      success: false,
      error: "Failed to fetch referral code",
    };
  }
}

// Find a referral code by its code value
export async function findReferralCodeByCode(code: string) {
  try {
    const { databases } = await createAdminClient();

    const response = await databases.listDocuments(
      DATABASE_ID,
      REFERRAL_CODES_COLLECTION_ID,
      [Query.equal("code", code)]
    );

    if (response.documents.length === 0) {
      return {
        success: false,
        error: "Referral code not found",
      };
    }

    return {
      success: true,
      data: response.documents[0],
    };
  } catch (error) {
    console.error("Error finding referral code:", error);
    return {
      success: false,
      error: "Failed to find referral code",
    };
  }
}

// Get all referral codes
export async function getAllReferralCodes() {
  try {
    const { databases } = await createAdminClient();

    const referralCodes = await databases.listDocuments(
      DATABASE_ID,
      REFERRAL_CODES_COLLECTION_ID,
      [
        Query.limit(1000), // Adjust the limit as needed
      ]
    );

    return {
      success: true,
      data: referralCodes.documents,
    };
  } catch (error) {
    console.error("Error fetching all referral codes:", error);
    return {
      success: false,
      error: "Failed to fetch referral codes",
    };
  }
}

// Update a referral code
export async function updateReferralCode(
  referralCodeId: string,
  updatedCode: string
) {
  try {
    const { databases } = await createAdminClient();

    const updatedReferralCode = await databases.updateDocument(
      DATABASE_ID,
      REFERRAL_CODES_COLLECTION_ID,
      referralCodeId,
      {
        code: updatedCode,
      }
    );

    return {
      success: true,
      data: updatedReferralCode,
    };
  } catch (error) {
    console.error("Error updating referral code:", error);
    return {
      success: false,
      error: "Failed to update referral code",
    };
  }
}

// Delete a referral code
export async function deleteReferralCode(referralCodeId: string) {
  try {
    const { databases } = await createAdminClient();

    await databases.deleteDocument(
      DATABASE_ID,
      REFERRAL_CODES_COLLECTION_ID,
      referralCodeId
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting referral code:", error);
    return {
      success: false,
      error: "Failed to delete referral code",
    };
  }
}

// Check if referral code exists
export async function validateReferralCode(code: string) {
  try {
    const result = await findReferralCodeByCode(code);
    return {
      success: result.success,
      valid: result.success,
    };
  } catch (error) {
    console.error("Error validating referral code:", error);
    return {
      success: false,
      valid: false,
      error: "Failed to validate referral code",
    };
  }
}
