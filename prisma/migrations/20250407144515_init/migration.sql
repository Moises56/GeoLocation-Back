BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [apellido] NVARCHAR(1000) NOT NULL,
    [correo] NVARCHAR(1000) NOT NULL,
    [nombreUsuario] NVARCHAR(1000) NOT NULL,
    [identidad] NVARCHAR(1000) NOT NULL,
    [telefono] NVARCHAR(1000) NOT NULL,
    [rol] NVARCHAR(1000) NOT NULL CONSTRAINT [User_rol_df] DEFAULT 'OPERADOR',
    [contrasena] NVARCHAR(1000) NOT NULL,
    [estado] BIT NOT NULL CONSTRAINT [User_estado_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_correo_key] UNIQUE NONCLUSTERED ([correo]),
    CONSTRAINT [User_nombreUsuario_key] UNIQUE NONCLUSTERED ([nombreUsuario]),
    CONSTRAINT [User_identidad_key] UNIQUE NONCLUSTERED ([identidad]),
    CONSTRAINT [User_telefono_key] UNIQUE NONCLUSTERED ([telefono])
);

-- CreateTable
CREATE TABLE [dbo].[Location] (
    [id] NVARCHAR(1000) NOT NULL,
    [key] NVARCHAR(1000),
    [userId] NVARCHAR(1000) NOT NULL,
    [latitud] FLOAT(53) NOT NULL,
    [longitud] FLOAT(53) NOT NULL,
    [timestamp] DATETIME2 NOT NULL CONSTRAINT [Location_timestamp_df] DEFAULT CURRENT_TIMESTAMP,
    [estado] NVARCHAR(1000) NOT NULL CONSTRAINT [Location_estado_df] DEFAULT 'activo',
    [destinoAsignado] NVARCHAR(1000),
    [tiempoEnDestino] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Location_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Location_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Log] (
    [id] NVARCHAR(1000) NOT NULL,
    [key] NVARCHAR(1000),
    [accion] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [timestamp] DATETIME2 NOT NULL CONSTRAINT [Log_timestamp_df] DEFAULT CURRENT_TIMESTAMP,
    [ip] NVARCHAR(1000) NOT NULL,
    [descripcion] NVARCHAR(1000),
    CONSTRAINT [Log_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Location_userId_idx] ON [dbo].[Location]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Log_userId_idx] ON [dbo].[Log]([userId]);

-- AddForeignKey
ALTER TABLE [dbo].[Location] ADD CONSTRAINT [Location_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Log] ADD CONSTRAINT [Log_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
