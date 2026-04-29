package com.petcare.backend.repository;

import com.petcare.backend.entity.PetEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PetEventRepository extends JpaRepository<PetEvent, Long> {
}
