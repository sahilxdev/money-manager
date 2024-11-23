import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';

export const SourceManagement = ({ sources, onUpdateSource, onDeleteSource, onAddSource }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [formData, setFormData] = useState({ name: '', initialBalance: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const sourceData = {
      id: editingSource?.id || `source-${Date.now()}`,
      name: formData.name,
      balance: parseFloat(formData.initialBalance) || 0,
    };

    if (editingSource) {
      onUpdateSource(sourceData);
    } else {
      onAddSource(sourceData);
    }

    setFormData({ name: '', initialBalance: '' });
    setEditingSource(null);
    setShowAddModal(false);
  };

  const handleEdit = (source) => {
    setEditingSource(source);
    setFormData({
      name: source.name,
      initialBalance: source.balance.toString(),
    });
    setShowAddModal(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Sources</CardTitle>
          <Button onClick={() => setShowAddModal(true)} size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Source
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.values(sources).map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{source.name}</p>
                  <p className="text-sm text-gray-500">
                    Balance: {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    }).format(source.balance)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(source)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteSource(source.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSource ? 'Edit Source' : 'Add New Source'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Source Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter source name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="balance">Initial Balance</Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                value={formData.initialBalance}
                onChange={(e) =>
                  setFormData({ ...formData, initialBalance: e.target.value })
                }
                placeholder="Enter initial balance"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit">
                {editingSource ? 'Update Source' : 'Add Source'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};