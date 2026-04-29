package com.petcare.backend.service;

import com.petcare.backend.entity.Pet;
import com.petcare.backend.repository.PetRepository;
import com.petcare.backend.repository.AppointmentRepository;
import com.petcare.backend.repository.MedicationRepository;
import com.petcare.backend.repository.VaccinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private MedicationRepository medicationRepository;

    @Autowired
    private VaccinationRepository vaccinationRepository;

    public Pet addPet(Pet pet) {
        return petRepository.save(pet);
    }

    public Pet getPetById(Long id) {
        return petRepository.findById(id).orElse(null);
    }

    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    public List<Pet> getPetsByOwnerId(Long ownerId) {
        return petRepository.findByOwnerId(ownerId);
    }

    public Pet updatePet(Long id, Pet updatedPet) {
        Pet pet = getPetById(id);
        if (pet != null) {
            pet.setName(updatedPet.getName());
            pet.setSpecies(updatedPet.getSpecies());
            pet.setBreed(updatedPet.getBreed());
            pet.setDateOfBirth(updatedPet.getDateOfBirth());
            pet.setGender(updatedPet.getGender());
            pet.setWeight(updatedPet.getWeight());
            pet.setColor(updatedPet.getColor());
            pet.setAllergies(updatedPet.getAllergies());
            pet.setSpecialNeeds(updatedPet.getSpecialNeeds());
            pet.setBehavioralTraits(updatedPet.getBehavioralTraits());
            
            return petRepository.save(pet);
        }
        return null;
    }

    @Transactional
    public void deletePet(Long id) {
        // First delete all dependent records
        appointmentRepository.deleteAll(appointmentRepository.findByPetId(id));
        medicationRepository.deleteAll(medicationRepository.findByPetId(id));
        vaccinationRepository.deleteAll(vaccinationRepository.findByPetId(id));
        
        // Finally delete the pet
        petRepository.deleteById(id);
    }
}
