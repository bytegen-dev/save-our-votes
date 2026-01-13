'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Election } from '@/lib/types/election';
import { EditElectionDialog } from './edit-election-dialog';
import { DeleteElectionDialog } from './delete-election-dialog';
import { ElectionCard } from './election-card';
import { api } from '@/lib/api/client';
import { showToast } from '@/lib/toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ElectionsGridProps {
  elections: Election[];
}

export function ElectionsGrid({ elections }: ElectionsGridProps) {
  const router = useRouter();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedElection, setSelectedElection] = useState<Election | null>(
    null
  );
  const [localElections, setLocalElections] = useState<Election[]>(elections);
  const [convertToDraftDialogOpen, setConvertToDraftDialogOpen] =
    useState(false);
  const [isConvertingToDraft, setIsConvertingToDraft] = useState(false);

  useEffect(() => {
    setLocalElections(elections);
  }, [elections]);

  const handleEdit = (election: Election) => {
    setSelectedElection(election);
    setTimeout(() => {
      setEditDialogOpen(true);
    }, 100);
  };

  const handleDelete = (election: Election) => {
    setSelectedElection(election);
    setTimeout(() => {
      setDeleteDialogOpen(true);
    }, 100);
  };

  const handleConvertToDraft = (election: Election) => {
    setSelectedElection(election);
    setTimeout(() => {
      setConvertToDraftDialogOpen(true);
    }, 100);
  };

  const handlePublish = async (election: Election) => {
    try {
      await api.elections.publish(election._id);
      showToast.success('Election published successfully!');
      handleSuccess();
    } catch (error: any) {
      showToast.error(
        error?.data?.message || error?.message || 'Failed to publish election'
      );
    }
  };

  const confirmConvertToDraft = async () => {
    if (!selectedElection?._id) return;

    try {
      setIsConvertingToDraft(true);
      await api.elections.convertToDraft(selectedElection._id);
      showToast.success('Election converted to draft successfully!');
      setConvertToDraftDialogOpen(false);
      setSelectedElection(null);
      handleSuccess();
    } catch (error: any) {
      console.error('Failed to convert to draft:', error);
      showToast.error(
        error?.data?.message || error?.message || 'Failed to convert to draft'
      );
    } finally {
      setIsConvertingToDraft(false);
    }
  };

  const handleSuccess = async () => {
    router.refresh();
    await new Promise((resolve) => setTimeout(resolve, 100));
  };

  return (
    <>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {localElections.map((election) => (
          <ElectionCard
            key={election._id}
            election={election}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onConvertToDraft={handleConvertToDraft}
            onPublish={handlePublish}
          />
        ))}
      </div>

      <EditElectionDialog
        election={selectedElection}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleSuccess}
      />

      <DeleteElectionDialog
        election={selectedElection}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleSuccess}
      />

      <AlertDialog
        open={convertToDraftDialogOpen}
        onOpenChange={setConvertToDraftDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Convert to Draft?</AlertDialogTitle>
            <AlertDialogDescription>
              This will convert the election{' '}
              <span className="text-foreground">
                &quot;{selectedElection?.title}&quot;
              </span>{' '}
              back to draft status. The election will no longer be visible to
              voters until you publish it again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isConvertingToDraft}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmConvertToDraft}
              disabled={isConvertingToDraft}
            >
              {isConvertingToDraft ? 'Converting...' : 'Convert to Draft'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
