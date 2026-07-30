import { useState } from 'react'
import { useEvaluations } from '@/hooks/useEvaluations'
import { Plus } from 'lucide-react'
import { EvaluationItem } from './EvaluationItem'
import { NewEvaluationDialog } from './NewEvaluationDialog'
import { Button } from './ui/button'

interface EvaluationsListProps {
  subjectId: string
}

export function EvaluationsList({ subjectId }: EvaluationsListProps) {
  const { data: evaluations, isLoading, error } = useEvaluations(subjectId)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className='p-1'>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold">Evaluaciones</h2>
        <Button variant='outline' onClick={() => setIsDialogOpen(true)}>
          <Plus size={16} />
        </Button>
      </div>
      {isLoading && <p className="text-gray-500">Cargando evaluations...</p>}
      {error && <p className="text-red-500">Error al cargar las evaluations.</p>}
      {evaluations?.map((ev) => (
        <EvaluationItem key={ev.id} evaluation={ev} subjectId={subjectId} />
      ))}
      <NewEvaluationDialog
        subjectId={subjectId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  )
}
