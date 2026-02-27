public class Node implements Comparable<Node> {
    public final String name;
    public double minDistance = Double.POSITIVE_INFINITY;
    public Node previous;

    public Node(String name) {
        this.name = name;
    }

    @Override
    public int compareTo(Node other) {
        return Double.compare(minDistance, other.minDistance);
    }

    @Override
    public String toString() {
        return name;
    }
}
