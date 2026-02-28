package T2_TP1_v1;

import java.util.Objects;

/**
 * Clase que representa un vértice o destino en el grafo de vuelos.
 */
public class Vertice implements Comparable<Vertice> {
    private String nombre;

    /**
     * Constructor de la clase Vertice.
     *
     * @param nombre Nombre del destino (por ejemplo, "d1").
     */
    public Vertice(String nombre) {
        this.nombre = nombre;
    }

    /**
     * Obtiene el nombre del destino.
     *
     * @return El nombre del destino.
     */
    public String getNombre() {
        return nombre;
    }

    /**
     * Compara este vértice con otro vértice basándose en su nombre.
     *
     * @param otro El otro vértice con el que se va a comparar.
     * @return Un entero negativo, cero o un entero positivo si este vértice es
     *         menor, igual o mayor que el vértice especificado.
     */
    @Override
    public int compareTo(Vertice otro) {
        return this.nombre.compareTo(otro.nombre);
    }

    /**
     * Verifica si este vértice es igual a otro objeto.
     *
     * @param obj El objeto a comparar.
     * @return Verdadero si son iguales (tienen el mismo nombre), falso en caso contrario.
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        Vertice vertice = (Vertice) obj;
        return Objects.equals(nombre, vertice.nombre);
    }

    /**
     * Devuelve un valor de código hash para el vértice.
     *
     * @return Un valor de código hash para este vértice.
     */
    @Override
    public int hashCode() {
        return Objects.hash(nombre);
    }

    /**
     * Devuelve una representación en formato de cadena de texto del vértice.
     *
     * @return El nombre del destino.
     */
    @Override
    public String toString() {
        return nombre;
    }
}
