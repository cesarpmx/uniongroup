/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.entity.global;

import com.entity.Link;
import java.util.ArrayList;

/**
 *
 * @author ray_w
 */
public class CentralRetornos {
    
    public ArrayList<ArrDataRetornos> items;  // ? Cambiar "Data" por "items"
    public boolean hasMore;
    public int total;
    public int limit;
    public int offset;
    public int count;
    public ArrayList<Link> links; 
    
}
