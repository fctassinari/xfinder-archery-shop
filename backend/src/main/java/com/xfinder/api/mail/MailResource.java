// Arquivo: MailResource.java atualizado
package com.xfinder.api.mail;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import io.smallrye.common.annotation.Blocking;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.regex.Pattern;

@Path("/mail")
public class MailResource {

// Teste
// curl -X POST http://localhost:8081/mail/contact -H "Content-Type: application/json" -d '{"nome": "João Silva","email": "joao@example.com","telefone": "(11) 99999-9999","assunto": "Dúvida sobre o produto","mensagem": "Gostaria de mais informações sobre o produto X."}'


    @Inject
    Mailer mailer;

    // Regex para validação básica de email
    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";
    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);

    @POST
    @Path("/contact")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Blocking
    public Response sendContactEmail(ContactForm contactForm) {
        try {
            // Validação dos campos obrigatórios
            if (contactForm.getNome() == null || contactForm.getNome().trim().isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ApiResponse("error", "Nome é obrigatório"))
                        .build();
            }

            if (contactForm.getEmail() == null || contactForm.getEmail().trim().isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ApiResponse("error", "Email é obrigatório"))
                        .build();
            }

            if (!isValidEmail(contactForm.getEmail())) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ApiResponse("error", "Email inválido"))
                        .build();
            }

            if (contactForm.getAssunto() == null || contactForm.getAssunto().trim().isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ApiResponse("error", "Assunto é obrigatório"))
                        .build();
            }

            if (contactForm.getMensagem() == null || contactForm.getMensagem().trim().isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ApiResponse("error", "Mensagem é obrigatória"))
                        .build();
            }

            // Construir o conteúdo do email
            String emailContent = buildEmailContent(contactForm);

            // Enviar o email
            mailer.send(
                    Mail.withText("contato.xfinder@gmail.com",
                                    "Novo Contato: " + contactForm.getAssunto(),
                                    emailContent
                            ).setReplyTo(contactForm.getEmail())
            );

            return Response.ok()
                    .entity(new ApiResponse("success", "Email enviado com sucesso!"))
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ApiResponse("error", "Erro ao enviar email: " + e.getMessage()))
                    .build();
        }
    }

    private boolean isValidEmail(String email) {
        return EMAIL_PATTERN.matcher(email).matches();
    }

    private String buildEmailContent(ContactForm contactForm) {
        StringBuilder content = new StringBuilder();
        content.append("Novo contato recebido:\n\n");
        content.append("Nome: ").append(contactForm.getNome()).append("\n");
        content.append("Email: ").append(contactForm.getEmail()).append("\n");
        content.append("Telefone: ").append(contactForm.getTelefone() != null ? contactForm.getTelefone() : "Não informado").append("\n");
        content.append("Assunto: ").append(contactForm.getAssunto()).append("\n");
        content.append("Mensagem: ").append(contactForm.getMensagem()).append("\n\n");
        content.append("---\nEste email foi enviado através do formulário de contato do site xfinder-archery.com.br.");

        return content.toString();
    }

    // Classe interna para padronizar as respostas
    public static class ApiResponse {
        private String status;
        private String message;

        public ApiResponse() {
        }

        public ApiResponse(String status, String message) {
            this.status = status;
            this.message = message;
        }

        // Getters e Setters
        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    // Adicione este método no MailResource para testar se a API está funcionando
    @GET
    @Path("/test")
    @Produces(MediaType.APPLICATION_JSON)
    public Response test() {
        return Response.ok()
                .entity(new ApiResponse("success", "API de email está funcionando!"))
                .build();
    }
}

