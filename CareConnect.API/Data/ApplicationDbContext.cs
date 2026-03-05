using CareConnect.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CareConnect.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        //DbSets for entities
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<Allergy> Allergies { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Patient configurations
            modelBuilder.Entity<Patient>(entity =>
            {
                entity.HasKey(e => e.PatientId);

                entity.HasOne(p => p.ApplicationUser)
                    .WithOne(u => u.Patient)
                    .HasForeignKey<Patient>(p => p.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.NHSNumber);
                entity.HasIndex(e => e.UserId).IsUnique();

                entity.Property(e => e.BloodType).HasConversion<string>();
                entity.Property(e => e.Gender).HasConversion<string>();
            });
            // Doctor configurations
            modelBuilder.Entity<Doctor>(entity =>
            {
                entity.HasKey(e => e.DoctorId);

                entity.HasOne(d => d.ApplicationUser)
                    .WithOne(u => u.Doctor)
                    .HasForeignKey<Doctor>(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.GMCNumber).IsUnique();
                entity.HasIndex(e => e.UserId).IsUnique();
            });
            // Appointment configurations
            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.HasKey(e => e.AppointmentId);
                entity.HasOne(a => a.Patient)
                    .WithMany(p => p.Appointments)
                    .HasForeignKey(a => a.PatientId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(a => a.Doctor)
                    .WithMany(d => d.Appointments)
                    .HasForeignKey(a => a.DoctorId)
                    .OnDelete(DeleteBehavior.Restrict); // Keep appointments even if doctor deleted
                // Store enum as string
                entity.Property(a => a.Type).HasConversion<string>();
                entity.Property(a => a.Status).HasConversion<string>();

                entity.HasIndex(e => e.AppointmentDate);
                entity.HasIndex(e => e.Status);
            });
            // AuditLog configurations
            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.HasKey(e => e.AuditId);

                entity.HasOne(a => a.ApplicationUser)
                    .WithMany(u => u.AuditLogs)
                    .HasForeignKey(a => a.UserId)
                    .OnDelete(DeleteBehavior.Restrict); // Keep logs even if user deleted

                entity.HasIndex(e => e.Timestamp);
                entity.HasIndex(e => e.TableName);
            });
            // MedicalRecord configurations
            modelBuilder.Entity<MedicalRecord>(entity =>
            {
                entity.HasKey(e => e.RecordId);
                entity.HasOne(m => m.Patient)
                    .WithMany(p => p.MedicalRecords)
                    .HasForeignKey(m => m.PatientId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(m => m.Doctor)
                    .WithMany(d => d.MedicalRecords)
                    .HasForeignKey(m => m.DoctorId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(m => m.RecordType).HasConversion<string>();

                entity.HasIndex(e => e.RecordDate);
                entity.HasIndex(e => e.PatientId);
            });
            //Prescription configurations
            modelBuilder.Entity<Prescription>(entity =>
            {
                entity.HasKey(e => e.PrescriptionId);
                entity.HasOne(pr => pr.Patient)
                    .WithMany(p => p.Prescriptions)
                    .HasForeignKey(pr => pr.PatientId)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(pr => pr.Doctor)
                    .WithMany(d => d.Prescriptions)
                    .HasForeignKey(pr => pr.DoctorId)
                    .OnDelete(DeleteBehavior.Restrict); // Keep prescriptions even if doctor deleted

                entity.HasOne(pr => pr.MedicalRecord)
                    .WithMany(m => m.Prescriptions)
                    .HasForeignKey(pr => pr.RecordId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.PatientId);
                entity.HasIndex(e => e.IsActive);
            });
            // Allergy configurations
            modelBuilder.Entity<Allergy>(entity =>
            {
                entity.HasKey(e => e.AllergyId);
                entity.HasOne(a => a.Patient)
                    .WithMany(p => p.Allergies)
                    .HasForeignKey(a => a.PatientId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(a => a.AllergyType).HasConversion<string>();
                entity.Property(a => a.Severity).HasConversion<string>();

                entity.HasIndex(e => e.PatientId);
            });

            // Seed initial roles
            modelBuilder.Entity<IdentityRole>().HasData(
               new IdentityRole
               {
                   Id = "1",
                   Name = "Patient",
                   NormalizedName = "PATIENT"
               },
                new IdentityRole
                {
                    Id = "2",
                    Name = "Doctor",
                    NormalizedName = "DOCTOR"
                },
                new IdentityRole
                {
                    Id = "3",
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                }
            );
        }
    }
}