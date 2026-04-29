package com.petcare.backend.controller;

import com.petcare.backend.entity.PetEvent;
import com.petcare.backend.repository.PetEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class PetEventController {

    @Autowired
    private PetEventRepository eventRepository;

    @GetMapping
    public List<PetEvent> getAllEvents() {
        return eventRepository.findAll();
    }

    @PostMapping
    public PetEvent createEvent(@RequestBody PetEvent event) {
        return eventRepository.save(event);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PetEvent> updateEvent(@PathVariable Long id, @RequestBody PetEvent updated) {
        return eventRepository.findById(id).map(event -> {
            event.setName(updated.getName());
            event.setType(updated.getType());
            event.setLocation(updated.getLocation());
            event.setDescription(updated.getDescription());
            event.setEventDate(updated.getEventDate());
            event.setCapacity(updated.getCapacity());
            event.setOrganizerName(updated.getOrganizerName());
            event.setJoinedCount(updated.getJoinedCount() != null ? updated.getJoinedCount() : event.getJoinedCount());
            return ResponseEntity.ok(eventRepository.save(event));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinEvent(@PathVariable Long id) {
        return eventRepository.findById(id).map(event -> {
            int current = event.getJoinedCount() != null ? event.getJoinedCount() : 0;
            if (event.getCapacity() != null && current >= event.getCapacity()) {
                return ResponseEntity.badRequest().body("This event has reached its maximum capacity.");
            }
            event.setJoinedCount(current + 1);
            eventRepository.save(event);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
