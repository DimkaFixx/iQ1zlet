import { useEffect, useState } from 'react'
import { getHello } from '../services/helloService'

interface UseHelloState {
  text: string
  loading: boolean
  error: string | null
}

const initialState: UseHelloState = {
  text: '',
  loading: true,
  error: null,
}

export function useHello() {
  const [state, setState] = useState<UseHelloState>(initialState)

  useEffect(() => {
    let isMounted = true

    async function loadHello() {
      try {
        const data = await getHello()

        if (!isMounted) {
          return
        }

        setState({
          text: data.hello,
          loading: false,
          error: null,
        })
      } catch {
        if (!isMounted) {
          return
        }

        setState({
          text: '',
          loading: false,
          error: 'Не удалось получить ответ от сервера',
        })
      }
    }

    loadHello()

    return () => {
      isMounted = false
    }
  }, [])

  return state
}
