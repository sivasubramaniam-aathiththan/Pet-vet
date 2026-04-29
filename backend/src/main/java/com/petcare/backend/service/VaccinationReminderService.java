package com.petcare.backend.service;

import com.petcare.backend.entity.Pet;
import com.petcare.backend.entity.User;
import com.petcare.backend.entity.Vaccination;
import com.petcare.backend.repository.PetRepository;
import com.petcare.backend.repository.UserRepository;
import com.petcare.backend.repository.VaccinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class VaccinationReminderService {

    @Autowired
    private VaccinationRepository vaccinationRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    // [LOGIC]: Cron job specifically configured to trigger this service method once daily at exactly midnight (server time).
    @Scheduled(cron = "0 0 0 * * *")
    public void sendVaccinationReminders() {
        // [BUSINESS LOGIC]: Calculate the target date by adding 3 days to the current date. Validates which vaccinations are exactly 3 days away.
        LocalDate reminderDate = LocalDate.now().plusDays(3);
        
        // [LOGIC]: Query database for all vaccinations matching the target due date.
        List<Vaccination> upcoming = vaccinationRepository.findByNextDueDate(reminderDate);

        // [LOGIC]: Iterate through identified upcoming vaccinations and fetch required context (Pet and Owner) for notification.
        for (Vaccination v : upcoming) {
            petRepository.findById(v.getPetId()).ifPresent(pet -> {
                userRepository.findById(pet.getOwnerId()).ifPresent(owner -> {
                    sendMockNotification(owner, pet, v);
                });
            });
        }
    }

    private void sendMockNotification(User owner, Pet pet, Vaccination vaccination) {
        // [LOGIC]: Dynamically format personalized notification string merging pet details and vaccine information.
        String message = String.format(
            "REMINDER: Your pet %s is due for a %s vaccination on %s. Please book an appointment.",
            pet.getName(),
            vaccination.getVaccineName(),
            vaccination.getNextDueDate()
        );

        // [LOGIC]: Mock output logic to console. Displays logic placeholder for SMS/Email gateway integration.
        System.out.println("MOCK NOTIFICATION SENT TO OWNER: " + owner.getEmail());
        System.out.println("PHONE: " + (owner.getPhone() != null ? owner.getPhone() : "N/A"));
        System.out.println("MESSAGE: " + message);
        System.out.println("--------------------------------------------------");
        
        // In a real system, you would call an EmailService or SMSService here.
    }
    
    // Manual trigger for testing
    public void triggerRemindersNow() {
        sendVaccinationReminders();
    }
}
