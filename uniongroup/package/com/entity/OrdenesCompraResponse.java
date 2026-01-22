/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.entity;

import java.util.ArrayList;

public class OrdenesCompraResponse {
    public ArrayList<PurchaseOrderLocal> items;
    public boolean hasMore;
    public int limit;
    public int offset;
    public int count;
}
