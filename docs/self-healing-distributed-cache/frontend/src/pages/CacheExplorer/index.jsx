import React, { useState } from 'react';
import DataTable from '../../components/tables/DataTable';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';
import { Search, Trash2, Plus } from 'lucide-react';
import { useCache } from '../../hooks/useCache';

const CacheExplorer = () => {
  const { useExportCache, useGetCache, useStoreCache, useDeleteCache } = useCache();
  const [searchKey, setSearchKey] = useState('user:session:9481');
  const [queryKey, setQueryKey] = useState('');

  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newTtl, setNewTtl] = useState('');

  const { data: exportData, isLoading: isExportLoading } = useExportCache();
  const { data: cacheData, isLoading, refetch, error: getError } = useGetCache(queryKey);
  const storeMutation = useStoreCache();
  const deleteMutation = useDeleteCache();

  const handleLookupKey = (e) => {
    e.preventDefault();
    const trimmed = searchKey ? searchKey.trim() : '';
    if (!trimmed) return;
    if (queryKey === trimmed) {
      refetch();
    } else {
      setQueryKey(trimmed);
    }
  };

  const handleStore = async (e) => {
    e.preventDefault();
    if (!newKey || !newValue) return;
    try {
      await storeMutation.mutateAsync({
        key: newKey,
        value: newValue,
        ttl: newTtl ? parseInt(newTtl, 10) : 3600
      });
      setNewKey('');
      setNewValue('');
      setNewTtl('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (keyToDelete) => {
    try {
      await deleteMutation.mutateAsync(keyToDelete);
    } catch (err) {
      console.error(err);
    }
  };

  const tableData = (exportData?.data || []).map(entry => ({
    key: entry.key,
    value: typeof entry.value === 'object' ? JSON.stringify(entry.value) : String(entry.value),
    ttl: entry.ttl ? `${entry.ttl}s` : 'N/A',
    node: entry.node || 'auto-routed',
    size: `${(typeof entry.value === 'object' ? JSON.stringify(entry.value) : String(entry.value)).length} B`
  }));

  const columns = [
    { key: 'key', label: 'Key', searchable: true, render: (val) => <span className="font-mono text-sm font-medium text-[var(--color-brand-cta)]">{val}</span> },
    { key: 'value', label: 'Value Preview', render: (val) => <span className="font-mono text-xs text-[var(--text-secondary)] truncate max-w-xs block">{val}</span> },
    { key: 'ttl', label: 'TTL' },
    { key: 'node', label: 'Assigned Node', render: (val) => <Badge variant="secondary" text={val || 'auto-routed'} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleDelete(row.key)}
          disabled={deleteMutation.isPending}
        >
          <Trash2 size={13} className="text-red-500 mr-1" />
          Delete
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cache Explorer"
        description="Inspect key-value pairs stored across cluster partitions, check TTLs, and view memory distribution."
      />

      {/* Key Search & Direct GET Section */}
      <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)] space-y-4">
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Live Key Lookup (GET /api/v1/cache/:key)</h2>
        <form onSubmit={handleLookupKey} className="flex gap-2">
          <Input
            placeholder="Enter cache key (e.g. user:session:9481)"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            fullWidth
          />
          <Button type="submit" disabled={isLoading} size="sm">
            <Search size={14} className="mr-1.5" />
            {isLoading ? 'Querying...' : 'Lookup Key'}
          </Button>
        </form>

        {queryKey && (
          <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-sm)] space-y-1 font-mono text-xs">
            {getError ? (
              <p className="text-red-500">Key "{queryKey}" not found or expired (404 Not Found)</p>
            ) : cacheData ? (
              <div>
                <p className="text-emerald-500 font-semibold mb-1">200 OK — Key Found in Cluster</p>
                <pre className="text-[var(--text-primary)]">{JSON.stringify(cacheData, null, 2)}</pre>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Store Key Section */}
      <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)] space-y-4">
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Store Key Entry (POST /api/v1/cache)</h2>
        <form onSubmit={handleStore} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input placeholder="Key" value={newKey} onChange={(e) => setNewKey(e.target.value)} required />
          <Input placeholder="Value" value={newValue} onChange={(e) => setNewValue(e.target.value)} required />
          <Input placeholder="TTL (seconds)" type="number" value={newTtl} onChange={(e) => setNewTtl(e.target.value)} />
          <Button type="submit" size="sm" disabled={storeMutation.isPending}>
            <Plus size={14} className="mr-1.5" />
            {storeMutation.isPending ? 'Storing...' : 'Store Key'}
          </Button>
        </form>
      </div>

      {/* Cluster Key Store Table */}
      <div>
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Cluster Key Store</h2>
        <DataTable
          columns={columns}
          data={tableData}
          searchable={true}
          pagination={true}
          pageSize={5}
          isLoading={isExportLoading}
        />
      </div>
    </div>
  );
};

export default CacheExplorer;
