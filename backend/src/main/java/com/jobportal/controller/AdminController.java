package com.jobportal.controller;

import com.jobportal.dto.PlatformStatsDto;
import com.jobportal.dto.UserResponseDto;
import com.jobportal.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        List<UserResponseDto> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully", "userId", String.valueOf(id)));
    }

    @GetMapping("/stats")
    public ResponseEntity<PlatformStatsDto> getStats() {
        PlatformStatsDto stats = adminService.getPlatformStats();
        return ResponseEntity.ok(stats);
    }
}
