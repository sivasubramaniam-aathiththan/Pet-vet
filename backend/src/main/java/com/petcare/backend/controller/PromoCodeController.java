package com.petcare.backend.controller;

import com.petcare.backend.entity.PromoCode;
import com.petcare.backend.service.PromoCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promocodes")
@CrossOrigin(origins = "http://localhost:3000")
public class PromoCodeController {

    @Autowired
    private PromoCodeService promoCodeService;

    @GetMapping
    public List<PromoCode> getAllPromoCodes() {
        return promoCodeService.getAllPromoCodes();
    }

    @PostMapping
    public PromoCode createPromoCode(@RequestBody PromoCode promoCode) {
        return promoCodeService.createPromoCode(promoCode);
    }

    @GetMapping("/validate/{code}")
    public ResponseEntity<PromoCode> validatePromoCode(@PathVariable String code) {
        PromoCode promoCode = promoCodeService.validatePromoCode(code);
        return promoCode != null ? ResponseEntity.ok(promoCode) : ResponseEntity.notFound().build();
    }
}
