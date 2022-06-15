#ifndef REPOSITORY_QUEUE_H
#define REPOSITORY_QUEUE_H

#include <string>
extern "C" {
#  include <opa_queue.h>
#  include <opa_primitives.h>
}

class RepositoryQueue {
public:
  RepositoryQueue();
  ~RepositoryQueue();

  void clear();
  int count();
  std::string dequeue();
  void enqueue(std::string repository);

private:
  struct RepositoryNode {
    OPA_Queue_element_hdr_t header;
    std::string repository;
  };
  OPA_Queue_info_t mQueue;
  OPA_int_t mNumRepositories;
};

#endif
