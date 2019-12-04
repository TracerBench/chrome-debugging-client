export type Task = () => void;

/**
 * Ensures each message will have its own microtask queue.
 */
export default function newTaskQueue(): (task: Task) => void {
  const queue: Task[] = [];
  let scheduled = false;
  let read = 0;
  let write = 0;
  return enqueue;

  function schedule(): void {
    scheduled = true;
    setImmediate(next);
  }

  function next(): void {
    scheduled = false;
    dequeue();
  }

  function enqueue(task: Task): void {
    queue[write++] = task;
    if (scheduled) {
      return;
    }
    schedule();
  }

  function dequeue(): void {
    const task = queue[read];
    // release memory
    queue[read++] = (undefined as unknown) as Task;
    if (read < write) {
      schedule();
    } else {
      // empty reset back to zero
      read = write = 0;
    }
    task();
  }
}
