"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Check, X, Trash, Eye } from "lucide-react";
import {
  getForms,
  updateFormStatus,
  deleteForm,
  getForm,
} from "@/lib/actions/forms.action";
import { findReferralCodeByCode } from "@/lib/actions/referral_codes.action";
import { Form, FormStatus, FormGender } from "@/lib/domains/forms.domain";
import { toast } from "sonner";
import { ReferralCode } from "@/lib/domains/referral_codes.domain";

export function FormResponsesTable() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [refCodeData, setRefCodeData] = useState<ReferralCode | null>(null);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    setLoading(true);
    try {
      const response = await getForms();
      if (response.success) {
        setForms(response.data as unknown as Form[]);
      } else {
        toast("Failed to load forms");
      }
    } catch (error) {
      toast("An error occurred while loading forms");
      console.error("Error loading forms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (formId: string, status: FormStatus) => {
    try {
      const response = await updateFormStatus(formId, status);
      if (response.success) {
        toast(
          status === FormStatus.APPROVED
            ? "Application approved"
            : "Application rejected"
        );
        loadForms();
      } else {
        toast("Failed to update status");
      }
    } catch (error) {
      toast("An error occurred while updating status");
      console.error("Error updating form status:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedFormId) return;

    try {
      const response = await deleteForm(selectedFormId);
      if (response.success) {
        toast("Application deleted successfully");
        setShowDeleteDialog(false);
        loadForms();
      } else {
        toast("Failed to delete application");
      }
    } catch (error) {
      toast("An error occurred while deleting application");
      console.error("Error deleting form:", error);
    }
  };

  const viewDetails = async (formId: string) => {
    try {
      setSelectedFormId(formId);

      const response = await getForm(formId);
      if (response.success) {
        setSelectedForm(response.data as unknown as Form);

        // Get referral code information
        if (response.data!.ref_code_id) {
          const refCodeResponse = await findReferralCodeByCode(
            response.data!.ref_code_id
          );
          if (refCodeResponse.success) {
            setRefCodeData(refCodeResponse.data! as unknown as ReferralCode);
          }
        }

        setShowDetailsDialog(true);
      } else {
        toast("Failed to load application details");
      }
    } catch (error) {
      toast("An error occurred while loading details");
      console.error("Error getting form details:", error);
    }
  };

  const confirmDelete = (formId: string) => {
    setSelectedFormId(formId);
    setShowDeleteDialog(true);
  };

  const getStatusBadge = (status: FormStatus) => {
    switch (status) {
      case FormStatus.SUBMITTED:
        return <Badge variant="outline">Submitted</Badge>;
      case FormStatus.APPROVED:
        return <Badge className="bg-green-500">Approved</Badge>;
      case FormStatus.REJECTED:
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateInput: string | Date) => {
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getGenderString = (gender: FormGender) => {
    switch (gender) {
      case FormGender.MALE:
        return "Male";
      case FormGender.FEMALE:
        return "Female";
      default:
        return "Unknown";
    }
  };

  if (loading) {
    return <div className="py-10 text-center">Loading form responses...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Reference Code</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 text-gray-500"
              >
                No form responses found
              </TableCell>
            </TableRow>
          ) : (
            forms.map((form) => (
              <TableRow key={form.$id}>
                <TableCell className="font-medium">{form.name}</TableCell>
                <TableCell>{form.email}</TableCell>
                <TableCell className="font-mono">{form.ref_code_id}</TableCell>
                <TableCell>{formatDate(form.submitted_at)}</TableCell>
                <TableCell>{getStatusBadge(form.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => viewDetails(form.$id!)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusChange(form.$id!, FormStatus.APPROVED)
                        }
                        disabled={form.status === FormStatus.APPROVED}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusChange(form.$id!, FormStatus.REJECTED)
                        }
                        disabled={form.status === FormStatus.REJECTED}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => confirmDelete(form.$id!)}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Detailed information about this application submission.
            </DialogDescription>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">
                    Status
                  </h3>
                  <div className="mt-1">
                    {getStatusBadge(selectedForm.status)}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">
                    Submitted
                  </h3>
                  <div className="mt-1">
                    {formatDate(selectedForm.submitted_at)}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-500">
                  Applicant
                </h3>
                <div className="mt-1 font-semibold">{selectedForm.name}</div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-500">
                  Email Address
                </h3>
                <div className="mt-1">{selectedForm.email}</div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-500">
                  Phone Number
                </h3>
                <div className="mt-1">{selectedForm.phone}</div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-500">Age</h3>
                <div className="mt-1">{selectedForm.age}</div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-500">Gender</h3>
                <div className="mt-1">
                  {getGenderString(selectedForm.gender)}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-500">
                  Has Local Bank Account
                </h3>
                <div className="mt-1">
                  {selectedForm.requirement ? (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 border-green-200"
                    >
                      Yes
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-red-100 text-red-800 border-red-200"
                    >
                      No
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-500">
                  Reference Code
                </h3>
                <div className="mt-1 font-mono">{selectedForm.ref_code_id}</div>
              </div>

              {refCodeData && (
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">
                    Reference Code ID
                  </h3>
                  <div className="mt-1 text-xs font-mono truncate">
                    {refCodeData.$id}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-sm text-gray-500">
                  Application ID
                </h3>
                <div className="mt-1 text-xs font-mono truncate">
                  {selectedForm.$id}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-start">
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() => setShowDetailsDialog(false)}
              >
                Close
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDetailsDialog(false);
                  handleStatusChange(selectedForm!.$id!, FormStatus.APPROVED);
                }}
                disabled={selectedForm?.status === FormStatus.APPROVED}
              >
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDetailsDialog(false);
                  handleStatusChange(selectedForm!.$id!, FormStatus.REJECTED);
                }}
                disabled={selectedForm?.status === FormStatus.REJECTED}
                className="text-red-600"
              >
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              applicant&apos;s submission from our database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
