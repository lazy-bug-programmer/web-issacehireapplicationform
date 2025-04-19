"use client";

import { useEffect, useState } from "react";
import {
  getAllReferralCodes,
  deleteReferralCode,
  updateReferralCode,
} from "@/lib/actions/referral_codes.action";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { ReferralCode } from "@/lib/domains/referral_codes.domain";
import { toast } from "sonner";

export function RefCodeTable({ refreshTrigger = 0 }) {
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCodeId, setSelectedCodeId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editCodeValue, setEditCodeValue] = useState("");

  useEffect(() => {
    loadReferralCodes();
  }, [refreshTrigger]);

  const loadReferralCodes = async () => {
    setLoading(true);
    try {
      const response = await getAllReferralCodes();
      if (response.success) {
        setReferralCodes(response.data as unknown as ReferralCode[]);
      } else {
        toast("Failed to load reference codes.");
      }
    } catch {
      toast("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCodeId) return;

    try {
      const response = await deleteReferralCode(selectedCodeId);
      if (response.success) {
        toast("Reference code has been deleted.");
        setShowDeleteDialog(false);
        loadReferralCodes();
      } else {
        toast(response.error || "Failed to delete reference code.");
      }
    } catch {
      toast("An unexpected error occurred.");
    }
  };

  const handleEdit = async () => {
    if (!selectedCodeId || !editCodeValue.trim()) return;

    try {
      const response = await updateReferralCode(selectedCodeId, editCodeValue);
      if (response.success) {
        toast(`Reference code has been updated to "${editCodeValue}".`);
        setShowEditDialog(false);
        loadReferralCodes();
      } else {
        toast(response.error || "Failed to update reference code.");
      }
    } catch {
      toast("An unexpected error occurred.");
    }
  };

  const confirmDelete = (codeId: string) => {
    setSelectedCodeId(codeId);
    setShowDeleteDialog(true);
  };

  const openEditDialog = (codeId: string, currentCode: string) => {
    setSelectedCodeId(codeId);
    setEditCodeValue(currentCode);
    setShowEditDialog(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">Loading reference codes...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reference Codes</CardTitle>
        <CardDescription>Manage existing reference codes.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referralCodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8">
                  No reference codes found
                </TableCell>
              </TableRow>
            ) : (
              referralCodes.map((code) => (
                <TableRow key={code.$id}>
                  <TableCell className="font-mono">{code.code}</TableCell>
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openEditDialog(code.$id!, code.code)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => confirmDelete(code.$id!)}
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

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                reference code and may affect users who are trying to use it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Reference Code</DialogTitle>
              <DialogDescription>
                Update the reference code value.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={editCodeValue}
                onChange={(e) => setEditCodeValue(e.target.value.toUpperCase())}
                placeholder="Enter new code"
                className="font-mono"
                maxLength={10}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
