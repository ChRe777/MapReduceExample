MapAndReduce with ForkJoin
===========================

![ForkJoin](https://upload.wikimedia.org/wikipedia/commons/f/f1/Fork_join.svg)

ForkJoinPool vs ThreadPoolExecutor benchmarks

Original copied from[GitHub](https://github.com/peschlowp/ForkJoin)here.


Fork–join model
----------------

In parallel computing, the fork–join model is a way of setting up and executing parallel programs, such that execution branches off in parallel at designated points in the program, to "join" (merge) at a subsequent point and resume sequential execution. Parallel sections may fork recursively until a certain task granularity is reached. Fork–join can be considered a parallel design pattern.[1]:209 ff. It was formulated as early as 1963.[2][3]

By nesting fork–join computations *recursively*, one obtains a parallel version of the divide and conquer paradigm, expressed by the following generic pseudocode:[4]

```
solve(problem):
    if problem is small enough:
        solve problem directly (sequential algorithm)
    else:
        for part in subdivide(problem)
            fork subtask to solve(part)
        join all subtasks spawned in previous loop
        return combined results
```

See also [Wiki Fork-Join](https://en.wikipedia.org/wiki/Fork%E2%80%93join_model)
