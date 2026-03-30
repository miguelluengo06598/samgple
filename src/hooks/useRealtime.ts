import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

type RealtimeConfig = {
  table: string
  filter?: string
  onInsert?: (payload: any) => void
  onUpdate?: (payload: any) => void
  onDelete?: (payload: any) => void
}

export function useRealtime(configs: RealtimeConfig[]) {
  const channelRef = useRef<any>(null)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel('realtime-' + Date.now())

    configs.forEach(config => {
      const opts: any = {
        event: '*',
        schema: 'public',
        table: config.table,
      }
      if (config.filter) opts.filter = config.filter

      channel.on('postgres_changes', opts, (payload: any) => {
        if (payload.eventType === 'INSERT' && config.onInsert) config.onInsert(payload.new)
        if (payload.eventType === 'UPDATE' && config.onUpdate) config.onUpdate(payload.new)
        if (payload.eventType === 'DELETE' && config.onDelete) config.onDelete(payload.old)
      })
    })

    channel.subscribe()
    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
}