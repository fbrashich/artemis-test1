package T2_TP1_v1;

import java.util.List;

/**
 * Clase principal para probar la funcionalidad del grafo de vuelos de la aerolínea Good Fly.
 */
public class Main {
    /**
     * Método principal que inicializa el grafo y ejecuta los casos de prueba solicitados.
     *
     * @param args Argumentos de la línea de comandos.
     */
    public static void main(String[] args) {
        Grafo aerolinea = new Grafo();

        // Destinos = { d1,d2,d3,d4,d5,d6,d7,d8,d9,d10,d11,d12,d13 }
        Vertice d1 = new Vertice("d1");
        Vertice d2 = new Vertice("d2");
        Vertice d3 = new Vertice("d3");
        Vertice d4 = new Vertice("d4");
        Vertice d5 = new Vertice("d5");
        Vertice d6 = new Vertice("d6");
        Vertice d7 = new Vertice("d7");
        Vertice d8 = new Vertice("d8");
        Vertice d9 = new Vertice("d9");
        Vertice d10 = new Vertice("d10");
        Vertice d11 = new Vertice("d11");
        Vertice d12 = new Vertice("d12");
        Vertice d13 = new Vertice("d13");

        // Añadir los vuelos (aristas) al grafo
        // Vuelos = {(d1,d2,200),(d1,d13,250),(d1,d9,290),(d2,d6,360),(d2,d3,190),(d3,d6,250),(d3,d5,190),(d3,d1,300),
        // (d4,d3,180),(d5,d6,300),(d5,d10,400),(d6,d11,350),(d6,d12,300),(d7,d4,300),(d7,d3,250),(d7,d1,150),
        // (d8,d7,200),(d8,d1,220),(d9,d8,180),(d9,d13,180),(d10,d4,200),(d11,d10,700),(d11,d5,200),
        // (d12,d2,150),(d13,d12,100),(d13,d2,200)}
        aerolinea.agregarArista(d1, d2, 200);
        aerolinea.agregarArista(d1, d13, 250);
        aerolinea.agregarArista(d1, d9, 290);
        aerolinea.agregarArista(d2, d6, 360);
        aerolinea.agregarArista(d2, d3, 190);
        aerolinea.agregarArista(d3, d6, 250);
        aerolinea.agregarArista(d3, d5, 190);
        aerolinea.agregarArista(d3, d1, 300);
        aerolinea.agregarArista(d4, d3, 180);
        aerolinea.agregarArista(d5, d6, 300);
        aerolinea.agregarArista(d5, d10, 400);
        aerolinea.agregarArista(d6, d11, 350);
        aerolinea.agregarArista(d6, d12, 300);
        aerolinea.agregarArista(d7, d4, 300);
        aerolinea.agregarArista(d7, d3, 250);
        aerolinea.agregarArista(d7, d1, 150);
        aerolinea.agregarArista(d8, d7, 200);
        aerolinea.agregarArista(d8, d1, 220);
        aerolinea.agregarArista(d9, d8, 180);
        aerolinea.agregarArista(d9, d13, 180);
        aerolinea.agregarArista(d10, d4, 200);
        aerolinea.agregarArista(d11, d10, 700);
        aerolinea.agregarArista(d11, d5, 200);
        aerolinea.agregarArista(d12, d2, 150);
        aerolinea.agregarArista(d13, d12, 100);
        aerolinea.agregarArista(d13, d2, 200);

        // Caso de prueba a validar: viaje de d1 a d11
        System.out.println("Caso de Prueba: Viaje más corto desde d1 a d11");
        List<Arista> ruta = aerolinea.obtenerRutaOptima(d1, d11);

        if (ruta != null && !ruta.isEmpty()) {
            System.out.println("Ruta encontrada:");
            int distanciaTotal = 0;
            for (Arista arista : ruta) {
                System.out.println(arista);
                distanciaTotal += arista.getDistancia();
            }
            System.out.println("Distancia total recorrida: " + distanciaTotal + " km");
        } else {
            System.out.println("No se encontró una ruta desde d1 a d11.");
        }
    }
}
