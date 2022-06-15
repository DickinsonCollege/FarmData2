#include "../includes/Queue.h"

RepositoryQueue::RepositoryQueue() {
  OPA_Queue_init(&mQueue);
  OPA_store_int(&mNumRepositories, 0);
}

RepositoryQueue::~RepositoryQueue() {
  clear();
}

void RepositoryQueue::clear() {
  while(!OPA_Queue_is_empty(&mQueue)) {
    RepositoryNode *node;

    OPA_decr_int(&mNumRepositories);
    OPA_Queue_dequeue(&mQueue, node, RepositoryNode, header);

    delete node;
  }
}

int RepositoryQueue::count() {
  return OPA_load_int(&mNumRepositories);
}

std::string RepositoryQueue::dequeue() {
  if (!OPA_Queue_is_empty(&mQueue)) {
    RepositoryNode *node;

    OPA_decr_int(&mNumRepositories);
    OPA_Queue_dequeue(&mQueue, node, RepositoryNode, header);

    std::string repository = node->repository;
    delete node;

    return repository;
  }
  return NULL;
}

void RepositoryQueue::enqueue(std::string repository) {
  RepositoryNode *node = new RepositoryNode;

  OPA_Queue_header_init(&node->header);

  node->repository = repository;

  OPA_Queue_enqueue(&mQueue, node, RepositoryNode, header);
  OPA_incr_int(&mNumRepositories);
}
