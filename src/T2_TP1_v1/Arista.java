package T2_TP1_v1;

/**
 * Clase que representa un vuelo (arista) entre dos destinos en el grafo.
 */
public class Arista {
    private Vertice origen;
    private Vertice destino;
    private int distancia;

    /**
     * Constructor de la clase Arista.
     *
     * @param origen    Destino de origen.
     * @param destino   Destino de llegada.
     * @param distancia Distancia en kilómetros entre origen y destino.
     */
    public Arista(Vertice origen, Vertice destino, int distancia) {
        this.origen = origen;
        this.destino = destino;
        this.distancia = distancia;
    }

    /**
     * Obtiene el vértice de origen.
     *
     * @return El vértice de origen.
     */
    public Vertice getOrigen() {
        return origen;
    }

    /**
     * Obtiene el vértice de destino.
     *
     * @return El vértice de destino.
     */
    public Vertice getDestino() {
        return destino;
    }

    /**
     * Obtiene la distancia del vuelo.
     *
     * @return La distancia en kilómetros.
     */
    public int getDistancia() {
        return distancia;
    }

    /**
     * Representación en cadena de texto de la arista.
     *
     * @return Una cadena que representa el vuelo y su distancia.
     */
    @Override
    public String toString() {
        return "(" + origen.getNombre() + " -> " + destino.getNombre() + " : " + distancia + " km)";
    }
}
