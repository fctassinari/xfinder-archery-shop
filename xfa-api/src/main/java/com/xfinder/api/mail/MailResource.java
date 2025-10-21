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

    @Inject
    Mailer mailer;

    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";
    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);

    // Endpoint original para texto simples
    @POST
    @Path("/contact")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Blocking
    public Response sendContactEmail(ContactForm contactForm) {
        try {
            // Validação dos campos obrigatórios
            Response validationResponse = validateContactForm(contactForm);
            if (validationResponse != null) {
                return validationResponse;
            }

            // Construir o conteúdo do email em texto simples
            String emailContent = buildEmailContent(contactForm);

            // Enviar o email em texto simples
            mailer.send(
                    Mail.withText("contato.xfinder@gmail.com",
                                    "Novo Contato: " + contactForm.getAssunto(),
                                    emailContent
                            ).setFrom("contato.xfinder@gmail.com")
                            .setReplyTo(contactForm.getEmail())
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

    // NOVO ENDPOINT para email HTML
    @POST
    @Path("/html")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Blocking
    public Response sendHtmlEmail(ContactForm contactForm) {
        try {
            // Validação dos campos obrigatórios
            Response validationResponse = validateContactForm(contactForm);
            if (validationResponse != null) {
                return validationResponse;
            }

            // Se não fornecer HTML, usa um template HTML padrão
            String htmlContent = contactForm.getHtmlContent();
//            if (htmlContent == null || htmlContent.trim().isEmpty()) {
//                htmlContent = buildDefaultHtmlContent(contactForm);
//            }

            // Enviar o email em HTML
            mailer.send(
                    Mail.withHtml(contactForm.getEmail(),
                                    contactForm.getAssunto(),
                                    htmlContent
                            ).setFrom("contato.xfinder@gmail.com")
                            .setReplyTo(contactForm.getEmail())
            );

            return Response.ok()
                    .entity(new ApiResponse("success", "Email HTML enviado com sucesso!"))
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ApiResponse("error", "Erro ao enviar email HTML: " + e.getMessage()))
                    .build();
        }
    }

    // Método de validação reutilizável
    private Response validateContactForm(ContactForm contactForm) {
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

        return null;
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
        content.append("---\nEste email foi enviado através do formulário de contato do site.");

        return content.toString();
    }
// Este metodo esta guardado para o caso de vir a ser utilizado
// Metodo para construir HTML padrão se não for fornecido
//    private String buildDefaultHtmlContent(ContactForm contactForm) {
//        return "<!DOCTYPE html>" +
//                "<html lang=\"pt-BR\">" +
//                "<head>" +
//                "    <meta charset=\"UTF-8\">" +
//                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
//                "    <title>Novo Contato</title>" +
//                "    <style>" +
//                "        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
//                "        .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
//                "        .header { background: #007bff; color: white; padding: 20px; text-align: center; }" +
//                "        .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }" +
//                "        .field { margin-bottom: 15px; }" +
//                "        .field-label { font-weight: bold; color: #007bff; }" +
//                "        .message { background: white; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0; }" +
//                "        .footer { margin-top: 20px; padding: 15px; background: #f1f1f1; text-align: center; font-size: 12px; color: #666; }" +
//                "    </style>" +
//                "</head>" +
//                "<body>" +
//                "    <div class=\"container\">" +
//                "        <div class=\"header\">" +
//                "            <h1>Novo Contato Recebido</h1>" +
//                "        </div>" +
//                "        <div class=\"content\">" +
//                "            <div class=\"field\">" +
//                "                <span class=\"field-label\">Nome:</span> " + contactForm.getNome() +
//                "            </div>" +
//                "            <div class=\"field\">" +
//                "                <span class=\"field-label\">Email:</span> " + contactForm.getEmail() +
//                "            </div>" +
//                "            <div class=\"field\">" +
//                "                <span class=\"field-label\">Telefone:</span> " +
//                (contactForm.getTelefone() != null ? contactForm.getTelefone() : "Não informado") +
//                "            </div>" +
//                "            <div class=\"field\">" +
//                "                <span class=\"field-label\">Assunto:</span> " + contactForm.getAssunto() +
//                "            </div>" +
//                "            <div class=\"message\">" +
//                "                <strong>Mensagem:</strong><br>" +
//                "                " + contactForm.getMensagem().replace("\n", "<br>") +
//                "            </div>" +
//                "        </div>" +
//                "        <div class=\"footer\">" +
//                "            Este email foi enviado através do formulário de contato do site XFinder." +
//                "        </div>" +
//                "    </div>" +
//                "</body>" +
//                "</html>";
//    }

    // Endpoint de teste
    @GET
    @Path("/test")
    @Produces(MediaType.APPLICATION_JSON)
    public Response test() {
        return Response.ok()
                .entity(new ApiResponse("success", "API de email está funcionando!"))
                .build();
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
}