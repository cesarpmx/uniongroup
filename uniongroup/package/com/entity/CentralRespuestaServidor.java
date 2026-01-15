/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.entity.inventario;

import com.entity.Link;
import java.util.ArrayList;

/**
 *
 * @author azielocampo
 */

public class CentralRespuestaServidor {
     public ArrayList<ArrRespServidor> items;
    public boolean hasMore;
    public int total;
    public int limit;
    public int offset;
    public int count;
    public ArrayList<Link> links; 
}