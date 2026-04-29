package com.petcare.backend.service;

import com.petcare.backend.entity.PromoCode;
import com.petcare.backend.repository.PromoCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PromoCodeService {

    @Autowired
    private PromoCodeRepository promoCodeRepository;

    public List<PromoCode> getAllPromoCodes() {
        return promoCodeRepository.findAll();
    }

    public PromoCode createPromoCode(PromoCode promoCode) {
        return promoCodeRepository.save(promoCode);
    }

    public PromoCode validatePromoCode(String code) {
        Optional<PromoCode> promoOpt = promoCodeRepository.findByCode(code);
        if (promoOpt.isPresent()) {
            PromoCode promo = promoOpt.get();
            if (promo.getIsActive() && (promo.getExpirationDate() == null || !promo.getExpirationDate().isBefore(LocalDate.now()))) {
                return promo; // Valid
            }
        }
        return null; // Invalid or expired
    }
}
