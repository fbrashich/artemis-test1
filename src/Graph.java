import java.util.PriorityQueue;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Map;
import java.util.HashMap;

public class Graph {
    private Map<String, Node> nodes = new HashMap<>();
    private Map<Node, List<Edge>> adjacencies = new HashMap<>();

    public void addNode(String name) {
        if (!nodes.containsKey(name)) {
            Node newNode = new Node(name);
            nodes.put(name, newNode);
            adjacencies.put(newNode, new ArrayList<>());
        }
    }

    public Node getNode(String name) {
        return nodes.get(name);
    }

    public void addEdge(String sourceName, String targetName, double weight) {
        Node source = nodes.get(sourceName);
        Node target = nodes.get(targetName);
        if (source != null && target != null) {
            adjacencies.get(source).add(new Edge(target, weight));
            // Suponemos grafo dirigido según el listado, pero si fuera bidireccional agregaríamos la vuelta
        } else {
            System.err.println("Nodos no encontrados para la arista: " + sourceName + " -> " + targetName);
        }
    }

    public void computePaths(String sourceName) {
        Node source = nodes.get(sourceName);
        if (source == null) return;

        // Inicializar
        for (Node node : nodes.values()) {
            node.minDistance = Double.POSITIVE_INFINITY;
            node.previous = null;
        }

        source.minDistance = 0.;
        PriorityQueue<Node> vertexQueue = new PriorityQueue<Node>();
        vertexQueue.add(source);

        while (!vertexQueue.isEmpty()) {
            Node u = vertexQueue.poll();

            // Visit each edge exiting u
            for (Edge e : adjacencies.get(u)) {
                Node v = e.target;
                double weight = e.weight;
                double distanceThroughU = u.minDistance + weight;
                if (distanceThroughU < v.minDistance) {
                    vertexQueue.remove(v);
                    v.minDistance = distanceThroughU;
                    v.previous = u;
                    vertexQueue.add(v);
                }
            }
        }
    }

    public List<Node> getShortestPathTo(String targetName) {
        Node target = nodes.get(targetName);
        List<Node> path = new ArrayList<Node>();
        if (target == null || target.minDistance == Double.POSITIVE_INFINITY) {
            return path; // empty path if unreachable
        }
        for (Node vertex = target; vertex != null; vertex = vertex.previous)
            path.add(vertex);
        Collections.reverse(path);
        return path;
    }
}
