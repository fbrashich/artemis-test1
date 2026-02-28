import java.util.List;

public class Main {
    public static void main(String[] args) {
        Graph graph = new Graph();

        // Destinos = { d1,d2,d3,d4,d5,d6,d7,d8,d9,d10,d11,d12,d13 }
        String[] destinos = {"d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "d13"};
        for (String destino : destinos) {
            graph.addNode(destino);
        }

        // Vuelos =
        // {(d1,d2,200),(d1,d13,250),(d1,d9,290),(d2,d6,360),(d2,d3,190),(d3,d6,250),(d3,d5,190),(d3,d1,300),
        // (d4,d3,180),(d5,d6,300),(d5,d10,400),(d6,d11,350),(d6,d12,300),(d7,d4,300),(d7,d3,250),(d7,d1,150),
        // (d8,d7,200),(d8,d1,220),(d9,d8,180),(d9,d13,180),(d10,d4,200),(d11,d10,700),(d11,d5,200),
        // (d12,d2,150),(d13,d12,100),(d13,d2,200)}

        // Agregar las aristas.
        graph.addEdge("d1", "d2", 200);
        graph.addEdge("d1", "d13", 250);
        graph.addEdge("d1", "d9", 290);

        graph.addEdge("d2", "d6", 360);
        graph.addEdge("d2", "d3", 190);

        graph.addEdge("d3", "d6", 250);
        graph.addEdge("d3", "d5", 190);
        graph.addEdge("d3", "d1", 300);

        graph.addEdge("d4", "d3", 180);

        graph.addEdge("d5", "d6", 300);
        graph.addEdge("d5", "d10", 400);

        graph.addEdge("d6", "d11", 350);
        graph.addEdge("d6", "d12", 300);

        graph.addEdge("d7", "d4", 300);
        graph.addEdge("d7", "d3", 250);
        graph.addEdge("d7", "d1", 150);

        graph.addEdge("d8", "d7", 200);
        graph.addEdge("d8", "d1", 220);

        graph.addEdge("d9", "d8", 180);
        graph.addEdge("d9", "d13", 180);

        graph.addEdge("d10", "d4", 200);

        graph.addEdge("d11", "d10", 700);
        graph.addEdge("d11", "d5", 200);

        graph.addEdge("d12", "d2", 150);

        graph.addEdge("d13", "d12", 100);
        graph.addEdge("d13", "d2", 200);

        // Prueba 1: Camino más corto desde d8 hasta d6
        String origen = "d1";
        String destino = "d10";
        System.out.println("Calculando el camino más corto desde " + origen + " hasta " + destino + ":");
        graph.computePaths(origen);

        Node targetNode = graph.getNode(destino);
        List<Node> path = graph.getShortestPathTo(destino);

        if (path.isEmpty()) {
            System.out.println("No hay camino desde " + origen + " a " + destino);
        } else {
            System.out.println("Camino: " + path);
            System.out.println("Distancia total: " + targetNode.minDistance);
        }

        // Agregar nuevos destinos
        System.out.println("\nAgregando nuevo destino d14 y ruta d6 -> d14 con distancia 150");
        graph.addNode("d14");
        graph.addEdge("d6", "d14", 150);

        origen = "d1";
        destino = "d14";
        System.out.println("Calculando el camino más corto desde " + origen + " hasta " + destino + ":");
        graph.computePaths(origen);

        targetNode = graph.getNode(destino);
        path = graph.getShortestPathTo(destino);

        if (path.isEmpty()) {
            System.out.println("No hay camino desde " + origen + " a " + destino);
        } else {
            System.out.println("Camino: " + path);
            System.out.println("Distancia total: " + targetNode.minDistance);
        }
    }
}
