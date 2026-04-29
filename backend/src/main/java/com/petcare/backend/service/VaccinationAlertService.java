package com.petcare.backend.service;

import com.petcare.backend.entity.Notification;
import com.petcare.backend.entity.Pet;
import com.petcare.backend.entity.Vaccination;
import com.petcare.backend.repository.NotificationRepository;
import com.petcare.backend.repository.PetRepository;
import com.petcare.backend.repository.VaccinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class VaccinationAlertService {

    @Autowired
    private VaccinationRepository vaccinationRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PetRepository petRepository;

    /**
     * Automated Task (runs every midnight)
     * Checks for upcoming and overdue vaccinations.
     */
    @Scheduled(cron = "0 0 0 * * ?") 
    public void generateVaccinationAlerts() {
        List<Vaccination> allVaccinations = vaccinationRepository.findAll();
        LocalDate today = LocalDate.now();

        for (Vaccination v : allVaccinations) {
            if (v.getNextDueDate() == null) continue;

            LocalDate due = v.getNextDueDate();
            Pet pet = petRepository.findById(v.getPetId()).orElse(null);
            if (pet == null) continue;

            long daysToDue = ChronoUnit.DAYS.between(today, due);

            // 1. UPCOMING ALERT (7 days before)
            if (daysToDue == 7) {
                createAlert(pet, v, "Upcoming Vaccination", 
                    "Reminder: " + pet.getName() + " is due for " + v.getVaccineName() + " in 7 days.", "UPCOMING");
                simulateExternalNotifications(pet, "Upcoming Vaccination: " + v.getVaccineName());
            }

            // 2. OVERDUE ALERT (1 day after)
            if (daysToDue == -1) {
                createAlert(pet, v, "Vaccination OVERDUE!", 
                    "Urgent: " + pet.getName() + "'s " + v.getVaccineName() + " was due yesterday!", "OVERDUE");
                simulateExternalNotifications(pet, "URGENT: Vaccination OVERDUE for " + pet.getName());
            }
        }
    }

    private void createAlert(Pet pet, Vaccination v, String title, String msg, String type) {
        Notification n = new Notification();
        n.setUserId(pet.getOwnerId());
        n.setPetId(pet.getId());
        n.setPetName(pet.getName());
        n.setTitle(title);
        n.setMessage(msg);
        n.setType(type);
        notificationRepository.save(n);
    }

    private void simulateExternalNotifications(Pet pet, String content) {
        // In a real system, these would call Twilio (SMS) or JavaMailSender (Email)
        System.out.println("[SMS ALERT] To: " + (pet.getOwnerId()) + " - Content: " + content);
        System.out.println("[EMAIL ALERT] To: owner_" + pet.getOwnerId() + "@petverse.com - Content: " + content);
    }
}
