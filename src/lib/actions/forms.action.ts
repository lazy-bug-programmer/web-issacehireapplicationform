"use server"

import { Query } from "node-appwrite";
import { createAdminClient } from "../appwrite/server";
import { Form, FormStatus } from "../domains/forms.domain";

// Database information
const DATABASE_ID = 'Core';
const FORMS_COLLECTION_ID = 'Forms';

// Create a new form
export async function createForm(form: Omit<Form, "$id" | "submitted_at" | "status">) {
    try {
        const { databases } = await createAdminClient();

        const newForm = await databases.createDocument(
            DATABASE_ID,
            FORMS_COLLECTION_ID,
            "unique()",
            {
                name: form.name,
                email: form.email,
                phone: form.phone,
                age: form.age,
                requirement: form.requirement,
                ref_code_id: form.ref_code_id,
                submitted_at: new Date().toISOString(),
                status: FormStatus.SUBMITTED
            }
        );

        return {
            success: true,
            data: newForm
        };
    } catch (error) {
        console.error("Error creating form:", error);
        return {
            success: false,
            error: "Failed to create form"
        };
    }
}

// Get a specific form by ID
export async function getForm(formId: string) {
    try {
        const { databases } = await createAdminClient();

        const form = await databases.getDocument(
            DATABASE_ID,
            FORMS_COLLECTION_ID,
            formId
        );

        return {
            success: true,
            data: form
        };
    } catch (error) {
        console.error("Error fetching form:", error);
        return {
            success: false,
            error: "Failed to fetch form"
        };
    }
}

// Get all forms with optional filters
export async function getForms(filters?: { status?: FormStatus }) {
    try {
        const { databases } = await createAdminClient();

        const queries = [];

        if (filters?.status !== undefined) {
            queries.push(Query.equal("status", filters.status));
        }

        const forms = await databases.listDocuments(
            DATABASE_ID,
            FORMS_COLLECTION_ID,
            queries
        );

        return {
            success: true,
            data: forms.documents
        };
    } catch (error) {
        console.error("Error fetching forms:", error);
        return {
            success: false,
            error: "Failed to fetch forms"
        };
    }
}

// Update a form
export async function updateForm(formId: string, updateData: Partial<Omit<Form, "$id">>) {
    try {
        const { databases } = await createAdminClient();

        const updatedForm = await databases.updateDocument(
            DATABASE_ID,
            FORMS_COLLECTION_ID,
            formId,
            updateData
        );

        return {
            success: true,
            data: updatedForm
        };
    } catch (error) {
        console.error("Error updating form:", error);
        return {
            success: false,
            error: "Failed to update form"
        };
    }
}

// Update form status
export async function updateFormStatus(formId: string, status: FormStatus) {
    return updateForm(formId, { status });
}

// Delete a form
export async function deleteForm(formId: string) {
    try {
        const { databases } = await createAdminClient();

        await databases.deleteDocument(
            DATABASE_ID,
            FORMS_COLLECTION_ID,
            formId
        );

        return {
            success: true
        };
    } catch (error) {
        console.error("Error deleting form:", error);
        return {
            success: false,
            error: "Failed to delete form"
        };
    }
}