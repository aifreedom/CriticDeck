const CONCURRENCY = 3

class FetchQueue {
  private active = 0
  private queue: Array<() => void> = []

  enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const run = () => {
        this.active++
        task()
          .then(resolve, reject)
          .finally(() => {
            this.active--
            if (this.queue.length > 0) {
              const next = this.queue.shift()!
              next()
            }
          })
      }

      if (this.active < CONCURRENCY) {
        run()
      } else {
        this.queue.push(run)
      }
    })
  }
}

export const metacriticFetchQueue = new FetchQueue()
