package com.programalilian.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/**
 * DTO for member creation requests.
 * Contains validation constraints for incoming data.
 */
public record CreateMemberRequest(

        @NotBlank(message = "Nombre completo es requerido") @Size(max = 255, message = "Nombre debe tener menos de 255 caracteres") String fullName,

        @NotBlank(message = "Email es requerido") @Email(message = "Email debe tener formato válido") @Size(max = 255, message = "Email debe tener menos de 255 caracteres") String email,

        @Size(max = 20, message = "Teléfono debe tener menos de 20 caracteres") String phone,

        LocalDate birthDate) {
}
