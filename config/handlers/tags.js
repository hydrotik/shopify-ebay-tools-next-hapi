'use strict';

const metafieldValue = require('../../src/utils/metafield-value');

module.exports = {
    "Gender": {
        "Unisex": [
            "Men's",
            "Women's"
        ],
        "Mens": "Men's"
    },
    "Movement": {
        "manual": "Mechanical (Hand-winding)",
        "QUARTZ": "Quartz (Battery)",
        "Electronic": "Quartz (Battery)",
        "Automatic": "Mechanical (Automatic)"
    },
    "Case Material": {
        "18k": "Gold",
        "14k": "Gold",
        "14K White Gold": "Gold",
        "14k Gold": "Gold",
        "18k Solid Rose Gold": "Rose Gold",
        "Rose Gold Plated": "Rose Gold",
        "18k Solid Gold Rolex": "Gold",
        "18k solid gold": "Gold",
        "Solid 18K Gold": "Gold",
        "18K solid gold Vacheron Constantin Case": "Gold",
        "18k gold bezel": "Gold",
        "Solid 18k Yellow Gold": "Gold",
        "Omega Stainless Steel Case": "Stainless Steel",
        "Original Stainless Steel Case": "Stainless Steel",
        "Gold Plated and Stainless Steel Case": ["Gold Plated", "Stainless Steel"],
        "Gold Plated And Stainless Steel": ["Gold Plated", "Stainless Steel"],
        "Gold And Stainless Steel": ["Gold Plated", "Stainless Steel"],
        "White Gold Plated And Stainless Steel": ["Gold Plated", "Stainless Steel"],
        "Stainless Steel Case": "Stainless Steel",
        "Gold-Filled": "Gold Plated",
        "Gold-capped": "Gold Plated",
        "Gold Inlay": "Gold Plated",
        "18k Gold Inlay": "Gold Plated",
        "gold capped": "Gold Plated",
        "Gold Capped": "Gold Plated",
        "Gold Plated Citizen Case": "Gold Plated",
        "14k gold and stainless steel": ["Gold", "Stainless Steel"],
        "gold plated and stainless steel": ["Gold Plated", "Stainless Steel"],
        "Stainless Steel and Solid 18K Gold": ["Gold", "Stainless Steel"],
        "diamond bezel": "Diamond Bezel",
        "Genuine Diamond Bezel": "Diamond Bezel",
        "Stainless Steel Rado Case": "Stainless Steel",
        "18k white gold with diamond bezel": ["White Gold", "Diamond Bezel"],
        "White Gold Plated": "White Gold"
    },
    "Vendor": (product) => {
        return `vendor:${product.vendor || 'Other'}`;
    },
    "Period": (product) => {
        const value = metafieldValue(product.metafields, 'year_of_manufacture');
        if (value) {
            return `period:${value}`;
        }
    },
    "Case Diameter": (product) => {
        const value = metafieldValue(product.metafields, 'case_diameter');
        if (value) {
            const diameter = value.toString()
              .split('x')
              .map(v => parseInt(v))
              .sort(function(a, b){return b-a})[0]

            return `case-diameter:${diameter}`;
        }
    },
    "Model": (product) => {
        const vendor = product.vendor.toLowerCase();
        const value = metafieldValue(product.metafields, 'model');
        const model = value
          ? value.toString()
            .toLowerCase()
            .replace(vendor, '')
            .trim()
            .split(' ')
            .map(v => v.charAt(0).toUpperCase() + v.slice(1))
            .join(' ')
          : 'Other';

        return `model:${model}`;
    }
};