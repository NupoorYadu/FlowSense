from collections import defaultdict, deque

from backend.models.workflow import Workflow, WorkflowNode


class WorkflowGraph:
    """Directed graph helper with O(V + E) traversal primitives."""

    def __init__(self, workflow: Workflow):
        self.workflow = workflow
        self.nodes_by_id = {node.id: node for node in workflow.nodes}
        self.adjacency: dict[str, list[str]] = defaultdict(list)
        self.reverse_adjacency: dict[str, list[str]] = defaultdict(list)
        self.in_degree: dict[str, int] = {node.id: 0 for node in workflow.nodes}
        self.out_degree: dict[str, int] = {node.id: 0 for node in workflow.nodes}

        for edge in workflow.edges:
            self.adjacency[edge.source].append(edge.target)
            self.reverse_adjacency[edge.target].append(edge.source)
            self.out_degree[edge.source] += 1
            self.in_degree[edge.target] += 1

    @property
    def start_nodes(self) -> list[WorkflowNode]:
        return [node for node in self.workflow.nodes if node.type == "start"]

    @property
    def end_nodes(self) -> list[WorkflowNode]:
        return [node for node in self.workflow.nodes if node.type == "end"]

    def reachable_from_starts(self) -> set[str]:
        queue = deque(node.id for node in self.start_nodes)
        visited = set(queue)

        while queue:
            node_id = queue.popleft()
            for neighbor in self.adjacency[node_id]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)

        return visited

    def nodes_that_can_reach_end(self) -> set[str]:
        queue = deque(node.id for node in self.end_nodes)
        visited = set(queue)

        while queue:
            node_id = queue.popleft()
            for predecessor in self.reverse_adjacency[node_id]:
                if predecessor not in visited:
                    visited.add(predecessor)
                    queue.append(predecessor)

        return visited

    def cycle_nodes(self) -> set[str]:
        visiting: set[str] = set()
        visited: set[str] = set()
        cycles: set[str] = set()

        def visit(node_id: str, path: list[str]) -> None:
            if node_id in visiting:
                cycle_start = path.index(node_id) if node_id in path else 0
                cycles.update(path[cycle_start:])
                return

            if node_id in visited:
                return

            visiting.add(node_id)
            path.append(node_id)

            for neighbor in self.adjacency[node_id]:
                visit(neighbor, path)

            path.pop()
            visiting.remove(node_id)
            visited.add(node_id)

        for node in self.workflow.nodes:
            visit(node.id, [])

        return cycles

    def topological_execution_order(self) -> list[str]:
        in_degree = dict(self.in_degree)
        queue = deque(node.id for node in self.start_nodes or self.workflow.nodes if in_degree[node.id] == 0)
        order: list[str] = []

        while queue:
            node_id = queue.popleft()
            order.append(node_id)

            for neighbor in self.adjacency[node_id]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

        if len(order) < len(self.workflow.nodes):
            remaining = [node.id for node in self.workflow.nodes if node.id not in set(order)]
            order.extend(remaining)

        return order
