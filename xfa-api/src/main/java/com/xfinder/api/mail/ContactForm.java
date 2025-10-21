// Arquivo: ContactForm.java atualizado
package com.xfinder.api.mail;

public class ContactForm {
    private String nome;
    private String email;
    private String telefone;
    private String assunto;
    private String mensagem;
    private String htmlContent; // Novo campo para conteúdo HTML

    // Construtores
    public ContactForm() {
    }

    public ContactForm(String nome, String email, String telefone, String assunto, String mensagem, String htmlContent) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.assunto = assunto;
        this.mensagem = mensagem;
        this.htmlContent = htmlContent;
    }

    // Getters e Setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getAssunto() {
        return assunto;
    }

    public void setAssunto(String assunto) {
        this.assunto = assunto;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public String getHtmlContent() {
        return htmlContent;
    }

    public void setHtmlContent(String htmlContent) {
        this.htmlContent = htmlContent;
    }
}