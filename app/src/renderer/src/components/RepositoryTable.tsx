import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/Table'
import Repository from '@/models/Repository'
import useStore, { useSelectedWorkspace } from '@/stores/store'
import { ReactElement } from 'react'
import RepositoryTableRow from './RepositoryTableRow'
import { Checkbox } from './shadcn/checkbox'

interface RepositoryTableProps {
  reposProcessing: string[]
  onSelectRepo: (repo: Repository) => void
}

export default function RepositoryTable({ reposProcessing, onSelectRepo }: RepositoryTableProps): ReactElement {
  const checkedRepos = useStore((store) => store.checkedRepos)
  const setCheckedRepos = useStore((store) => store.setCheckedRepos)

  const toggleAll = (value: boolean): void => {
    setCheckedRepos(Object.fromEntries(Object.keys(checkedRepos).map((key) => [key, value])))
  }

  const selectedWorkspace = useSelectedWorkspace()
  const repositories = selectedWorkspace?.repositories.sort((a, b) => a.name.localeCompare(b.name))

  return (
    <Table className="bg-secondary/50 mt-0 rounded-lg">
      <TableHeader>
        <TableRow>
          <TableHead className="w-2">
            <label className="p-2 cursor-pointer">
              <Checkbox
                checked={Object.values(checkedRepos).every((value) => value === true)}
                onCheckedChange={(checked: boolean) => toggleAll(checked)}
              />
            </label>
          </TableHead>
          <TableHead>Repository</TableHead>
          <TableHead>Branch</TableHead>
          <TableHead>Latest Commit</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center text-nowrap">Behind | Ahead</TableHead>
          <TableHead></TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {repositories?.map((repo) => (
          <RepositoryTableRow
            onClick={() => onSelectRepo(repo)}
            key={repo.path}
            repository={repo}
            processing={reposProcessing.includes(repo.path)}
          />
        ))}
        {repositories?.length === 0 && (
          <TableRow>
            <TableCell colSpan={8}>
              <i>Click the `Add repositories` button to add repositories.</i>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
