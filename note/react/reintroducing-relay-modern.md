# Note from Reintroducing Relay Modern by Denis Badurina

[It's on Youtube.](https://www.youtube.com/watch?v=5WjXX9-Vu-o)

## Data driven views

Concerns that require trackling

- Fetching all the data for a view
- Deciding when and how to fetch
- Managing errors
- Retrying failed requests
- Updating the local cache after receiving responses
- Optimistically updating the UI

Relay Modern gives all features for these problems.

## The compiler

- Generates Ahead-of-time definitions (in Flow or TypeScript)
- Makes runtime represntations of the queries/mutations
- Optimizes GraphQL requests for the runtime

## The runtime

- Proivdes a normalized, in-memory object cache
- Optimized "write operations"
- Mechanism for subscribing to data in the cache
- Garbage collection
- Mutations with optimistic updates
