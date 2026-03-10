'use client'

import { useAppStore, AVAILABLE_MODELS } from '@/store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Cpu } from 'lucide-react'

export function ModelSelector() {
  const { selectedModel, setSelectedModel } = useAppStore()

  return (
    <Select
      value={selectedModel.id}
      onValueChange={(value) => {
        const model = AVAILABLE_MODELS.find(m => m.id === value)
        if (model) setSelectedModel(model)
      }}
    >
      <SelectTrigger className="w-[200px] h-9">
        <Cpu className="w-4 h-4 mr-2" />
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        {AVAILABLE_MODELS.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex items-center gap-2">
              <span>{model.name}</span>
              <Badge variant="outline" className="text-xs capitalize">
                {model.provider}
              </Badge>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
