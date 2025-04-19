import { FormResponsesTable } from "@/components/form-responses-table";

export default function FormResponsesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Form Responses
        </h1>
        <p className="text-muted-foreground mt-2">
          View and manage application submissions.
        </p>
      </div>

      <FormResponsesTable />
    </div>
  );
}
