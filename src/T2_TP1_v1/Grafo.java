package T2_TP1_v1;

import java.util.*;

/**
 * Clase que representa el mapa de vuelos de la aerolínea como un grafo ponderado y dirigido.
 */
public class Grafo {
    private Map<Vertice, List<Arista>> listaAdyacencia;

    /**
     * Constructor para inicializar el grafo.
     */
    public Grafo() {
        this.listaAdyacencia = new HashMap<>();
    }

    /**
     * Añade un nuevo destino (vértice) al grafo.
     *
     * @param vertice El vértice a añadir.
     */
    public void agregarVertice(Vertice vertice) {
        listaAdyacencia.putIfAbsent(vertice, new ArrayList<>());
    }

    /**
     * Añade un vuelo (arista) entre dos destinos existentes.
     *
     * @param origen    Destino de origen.
     * @param destino   Destino de llegada.
     * @param distancia Distancia en kilómetros.
     */
    public void agregarArista(Vertice origen, Vertice destino, int distancia) {
        agregarVertice(origen);
        agregarVertice(destino);
        listaAdyacencia.get(origen).add(new Arista(origen, destino, distancia));
    }

    /**
     * Encuentra el camino más corto entre dos destinos usando el algoritmo de Dijkstra.
     *
     * @param origen  Destino de partida.
     * @param destino Destino de llegada.
     * @return Una lista de aristas que representan la ruta óptima, o null si no hay camino.
     */
    public List<Arista> obtenerRutaOptima(Vertice origen, Vertice destino) {
        if (!listaAdyacencia.containsKey(origen) || !listaAdyacencia.containsKey(destino)) {
            return null;
        }

        Map<Vertice, Integer> distancias = new HashMap<>();
        Map<Vertice, Arista> predecesores = new HashMap<>();
        PriorityQueue<NodoDistancia> colaPrioridad = new PriorityQueue<>(Comparator.comparingInt(n -> n.distancia));

        for (Vertice v : listaAdyacencia.keySet()) {
            distancias.put(v, Integer.MAX_VALUE);
        }

        distancias.put(origen, 0);
        colaPrioridad.add(new NodoDistancia(origen, 0));

        while (!colaPrioridad.isEmpty()) {
            NodoDistancia actual = colaPrioridad.poll();
            Vertice u = actual.vertice;

            if (u.equals(destino)) {
                break; // Se alcanzó el destino
            }

            if (actual.distancia > distancias.get(u)) {
                continue; // Nodo ya procesado con una distancia menor
            }

            for (Arista arista : listaAdyacencia.getOrDefault(u, Collections.emptyList())) {
                Vertice v = arista.getDestino();
                int peso = arista.getDistancia();
                int nuevaDistancia = distancias.get(u) + peso;

                if (nuevaDistancia < distancias.get(v)) {
                    distancias.put(v, nuevaDistancia);
                    predecesores.put(v, arista);
                    colaPrioridad.add(new NodoDistancia(v, nuevaDistancia));
                }
            }
        }

        // Reconstruir el camino desde el destino al origen
        List<Arista> ruta = new ArrayList<>();
        Vertice actual = destino;

        while (predecesores.containsKey(actual)) {
            Arista arista = predecesores.get(actual);
            ruta.add(arista);
            actual = arista.getOrigen();
        }

        if (ruta.isEmpty() && !origen.equals(destino)) {
            return null; // No hay ruta
        }

        Collections.reverse(ruta);
        return ruta;
    }

    /**
     * Clase auxiliar para la cola de prioridad en Dijkstra.
     */
    private static class NodoDistancia {
        Vertice vertice;
        int distancia;

        NodoDistancia(Vertice vertice, int distancia) {
            this.vertice = vertice;
            this.distancia = distancia;
        }
    }
}
