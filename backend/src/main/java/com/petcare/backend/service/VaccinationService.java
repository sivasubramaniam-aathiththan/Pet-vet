package com.petcare.backend.service;

import com.petcare.backend.entity.Vaccination;
import com.petcare.backend.repository.VaccinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VaccinationService {
    @Autowired
    private VaccinationRepository vaccinationRepository;

    public Vaccination addVaccination(Vaccination vaccination) {
        return vaccinationRepository.save(vaccination);
    }

    public List<Vaccination> getAllVaccinations() {
        return vaccinationRepository.findAll();
    }

    public Vaccination getVaccinationById(Long id) {
        return vaccinationRepository.findById(id).orElse(null);
    }

    public List<Vaccination> getVaccinationsByPetId(Long petId) {
        return vaccinationRepository.findByPetId(petId);
    }

    public List<Vaccination> getVaccinationsByVetId(Long vetId) {
        return vaccinationRepository.findByVeterinarianId(vetId);
    }

    public Vaccination updateVaccination(Long id, Vaccination vaccinationDetails) {
        Vaccination vaccination = getVaccinationById(id);
        if (vaccination != null) {
            vaccination.setVaccineName(vaccinationDetails.getVaccineName());
            vaccination.setDateGiven(vaccinationDetails.getDateGiven());
            vaccination.setNextDueDate(vaccinationDetails.getNextDueDate());
            vaccination.setRemarks(vaccinationDetails.getRemarks());
            vaccination.setPetName(vaccinationDetails.getPetName());
            return vaccinationRepository.save(vaccination);
        }
        return null;
    }

    public void deleteVaccination(Long id) {
        vaccinationRepository.deleteById(id);
    }
}
