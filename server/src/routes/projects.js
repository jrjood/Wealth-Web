import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getConnection, query } from '../lib/db.js';
import {
  createProjectMediaUpload,
  deleteUploadedImage,
  toPublicUploadUrl,
} from '../lib/imageUpload.js';

const router = express.Router();
const { upload: projectAssetUpload } = createProjectMediaUpload('projects');

const projectUpload = projectAssetUpload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'projectLogoFile', maxCount: 1 },
  { name: 'projectVideoFile', maxCount: 1 },
  { name: 'masterPlanImageFile', maxCount: 1 },
  { name: 'locationImageFile', maxCount: 1 },
  { name: 'galleryImagesFiles', maxCount: 12 },
]);

const toBoolean = (value) => value === 1 || value === true || value === '1';

const parseBoolean = (value) =>
  value === true || value === 1 || value === '1' || value === 'true';

const normalizeString = (value) =>
  typeof value === 'string' ? value.trim() : '';

const getPrimaryLocation = (location) =>
  normalizeString(location).split(',')[0]?.trim() || normalizeString(location);

const slugifyProjectPart = (value) =>
  normalizeString(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getProjectSlug = (project) =>
  [slugifyProjectPart(project.title), slugifyProjectPart(getPrimaryLocation(project.location))]
    .filter(Boolean)
    .join('-');

const parseJsonArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  const normalized = normalizeString(value);
  if (!normalized) {
    return [];
  }

  try {
    const parsed = JSON.parse(normalized);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getSingleFile = (files, fieldName) => {
  const file = files?.[fieldName];
  return Array.isArray(file) ? file[0] : null;
};

const getMultiFiles = (files, fieldName) =>
  Array.isArray(files?.[fieldName]) ? files[fieldName] : [];

const toUploadUrl = (file) =>
  file ? toPublicUploadUrl('projects', file.filename) : null;

const pathBasenameWithoutExtension = (fileName) => {
  const normalized = normalizeString(fileName);
  if (!normalized) {
    return null;
  }

  return normalized.replace(/\.[^/.]+$/, '') || null;
};

const mapProject = (project) => ({
  ...project,
  featured: toBoolean(project.featured),
});

const mapGalleryImage = (image) => ({
  id: image.id,
  imageUrl: image.imageUrl,
  title: image.title,
  sortOrder: image.sortOrder,
});

const mapNearbyLocation = (location) => ({
  id: location.id,
  name: location.name,
  distance: location.distance,
  sortOrder: location.sortOrder,
});

const mapPaymentPlan = (paymentPlan) =>
  paymentPlan
    ? {
        id: paymentPlan.id,
        downPayment: paymentPlan.downPayment,
        installments: paymentPlan.installments,
        startingPrice: paymentPlan.startingPrice,
      }
    : null;

const buildProjectWhere = ({ type, status, featured }) => {
  const clauses = [];
  const params = [];

  if (type) {
    clauses.push('type = ?');
    params.push(type);
  }

  if (status) {
    clauses.push('status = ?');
    params.push(status);
  }

  if (featured === 'true') {
    clauses.push('featured = 1');
  }

  return {
    whereSql: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
    params,
  };
};

const resolveSingleImageUrl = ({ file, directUrl, existingUrl }) => {
  if (file) {
    return toUploadUrl(file);
  }

  const normalizedDirectUrl = normalizeString(directUrl);
  if (normalizedDirectUrl) {
    return normalizedDirectUrl;
  }

  const normalizedExistingUrl = normalizeString(existingUrl);
  return normalizedExistingUrl || null;
};

const parseGalleryImages = (body, files) => {
  const parsedEntries = parseJsonArray(body.galleryImages).map((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      return null;
    }

    const imageUrl = normalizeString(entry.imageUrl);
    if (!imageUrl) {
      return null;
    }

    return {
      id: normalizeString(entry.id) || `gal_${Date.now()}_${index}`,
      imageUrl,
      title: normalizeString(entry.title) || null,
      sortOrder:
        Number.isFinite(Number(entry.sortOrder)) ? Number(entry.sortOrder) : index,
    };
  });

  const uploadedEntries = getMultiFiles(files, 'galleryImagesFiles').map(
    (file, index) => ({
      id: `gal_${Date.now()}_file_${index}`,
      imageUrl: toUploadUrl(file),
      title: pathBasenameWithoutExtension(file.originalname),
      sortOrder: parsedEntries.filter(Boolean).length + index,
    }),
  );

  return [...parsedEntries.filter(Boolean), ...uploadedEntries];
};

const parseNearbyLocations = (body) =>
  parseJsonArray(body.nearbyLocations)
    .map((entry, index) => {
      if (!entry || typeof entry !== 'object') {
        return null;
      }

      const name = normalizeString(entry.name);
      const distance = normalizeString(entry.distance);

      if (!name || !distance) {
        return null;
      }

      return {
        id: normalizeString(entry.id) || `loc_${Date.now()}_${index}`,
        name,
        distance,
        sortOrder:
          Number.isFinite(Number(entry.sortOrder)) ? Number(entry.sortOrder) : index,
      };
    })
    .filter(Boolean);

const parsePaymentPlan = (body) => {
  const parsed = body.paymentPlan
    ? (() => {
        try {
          return JSON.parse(body.paymentPlan);
        } catch {
          return null;
        }
      })()
    : null;

  if (!parsed || typeof parsed !== 'object') {
    return null;
  }

  const downPayment = normalizeString(parsed.downPayment);
  const installments = normalizeString(parsed.installments);
  const startingPrice = normalizeString(parsed.startingPrice);

  if (!downPayment && !installments && !startingPrice) {
    return null;
  }

  return {
    id: normalizeString(parsed.id) || `pay_${Date.now()}`,
    downPayment,
    installments,
    startingPrice,
  };
};

const fetchProjectById = async (projectId) => {
  const rows = await query(
    'SELECT id, title, location, type, status, description, details, imageUrl, projectLogoUrl, masterPlanImage, videoUrl, locationImage, locationMapUrl, brochureUrl, featured, amenities, specifications, createdAt, updatedAt FROM `Project` WHERE id = ? LIMIT 1',
    [projectId],
  );

  const project = rows[0];

  if (!project) {
    return null;
  }

  const [galleryImages, nearbyLocations, paymentPlanRows] = await Promise.all([
    query(
      'SELECT id, imageUrl, title, sortOrder FROM `GalleryImage` WHERE projectId = ? ORDER BY sortOrder ASC, createdAt ASC',
      [projectId],
    ),
    query(
      'SELECT id, name, distance, sortOrder FROM `NearbyLocation` WHERE projectId = ? ORDER BY sortOrder ASC, createdAt ASC',
      [projectId],
    ),
    query(
      'SELECT id, downPayment, installments, startingPrice FROM `PaymentPlan` WHERE projectId = ? LIMIT 1',
      [projectId],
    ),
  ]);

  return {
    ...mapProject(project),
    galleryImages: galleryImages.map(mapGalleryImage),
    nearbyLocations: nearbyLocations.map(mapNearbyLocation),
    paymentPlan: mapPaymentPlan(paymentPlanRows[0] || null),
  };
};

const fetchProjectByIdentifier = async (identifier) => {
  const projectById = await fetchProjectById(identifier);

  if (projectById) {
    return projectById;
  }

  const projects = await query(
    'SELECT id, title, location FROM `Project` ORDER BY createdAt DESC',
  );
  const matchingProject = projects.find(
    (project) => getProjectSlug(project) === identifier,
  );

  return matchingProject ? fetchProjectById(matchingProject.id) : null;
};

const syncProjectRelations = async (connection, projectId, payload) => {
  await connection.execute('DELETE FROM `GalleryImage` WHERE projectId = ?', [
    projectId,
  ]);
  await connection.execute('DELETE FROM `NearbyLocation` WHERE projectId = ?', [
    projectId,
  ]);
  await connection.execute('DELETE FROM `PaymentPlan` WHERE projectId = ?', [
    projectId,
  ]);

  for (const image of payload.galleryImages) {
    await connection.execute(
      'INSERT INTO `GalleryImage` (id, projectId, imageUrl, title, sortOrder, updatedAt) VALUES (?, ?, ?, ?, ?, NOW())',
      [
        image.id,
        projectId,
        image.imageUrl,
        image.title || null,
        image.sortOrder ?? 0,
      ],
    );
  }

  for (const location of payload.nearbyLocations) {
    await connection.execute(
      'INSERT INTO `NearbyLocation` (id, projectId, name, distance, sortOrder, updatedAt) VALUES (?, ?, ?, ?, ?, NOW())',
      [
        location.id,
        projectId,
        location.name,
        location.distance,
        location.sortOrder ?? 0,
      ],
    );
  }

  if (payload.paymentPlan) {
    await connection.execute(
      'INSERT INTO `PaymentPlan` (id, projectId, downPayment, installments, startingPrice, updatedAt) VALUES (?, ?, ?, ?, ?, NOW())',
      [
        payload.paymentPlan.id,
        projectId,
        payload.paymentPlan.downPayment,
        payload.paymentPlan.installments,
        payload.paymentPlan.startingPrice,
      ],
    );
  }
};

const cleanupProjectImages = async (imageUrls) => {
  for (const imageUrl of imageUrls) {
    await deleteUploadedImage(imageUrl);
  }
};

const collectProjectImages = (project, galleryImages = []) =>
  [
    project?.imageUrl,
    project?.projectLogoUrl,
    project?.videoUrl,
    project?.masterPlanImage,
    project?.locationImage,
    ...galleryImages.map((image) => image.imageUrl),
  ].filter(Boolean);

// Public route - Get all published projects
router.get('/', async (req, res) => {
  try {
    const { type, status, featured } = req.query;
    const { whereSql, params } = buildProjectWhere({ type, status, featured });

    const projects = await query(
      `SELECT id, title, location, type, status, description, details, imageUrl, projectLogoUrl, featured, amenities, specifications, createdAt, updatedAt FROM \`Project\` ${whereSql} ORDER BY createdAt DESC`,
      params,
    );

    res.json(projects.map(mapProject));
  } catch (error) {
    console.error('Error fetching projects:', error);
    if (error.message?.includes('Database not configured')) {
      return res.json([]);
    }
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Public route - Get single project by ID or public slug
router.get('/:id', async (req, res) => {
  try {
    const project = await fetchProjectByIdentifier(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    if (error.message?.includes('Database not configured')) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

router.use(authMiddleware);

// Create new project
router.post('/', (req, res) => {
  projectUpload(req, res, async (error) => {
    if (error) {
      return res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : 'Unable to process uploaded image',
      });
    }

    let connection;

    try {
      const {
        id,
        title,
        location,
        type,
        status,
        description,
        details,
        imageUrl,
        existingImageUrl,
        projectLogoUrl,
        existingProjectLogoUrl,
        masterPlanImage,
        existingMasterPlanImage,
        locationImage,
        existingLocationImage,
        locationMapUrl,
        brochureUrl,
        featured,
        amenities,
        specifications,
        videoUrl,
      } = req.body;

      if (!title || !location || !type || !status || !description) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const projectImage = resolveSingleImageUrl({
        file: getSingleFile(req.files, 'image'),
        directUrl: imageUrl,
        existingUrl: existingImageUrl,
      });
      const nextProjectLogoUrl = resolveSingleImageUrl({
        file: getSingleFile(req.files, 'projectLogoFile'),
        directUrl: projectLogoUrl,
        existingUrl: existingProjectLogoUrl,
      });
      const nextMasterPlanImage = resolveSingleImageUrl({
        file: getSingleFile(req.files, 'masterPlanImageFile'),
        directUrl: masterPlanImage,
        existingUrl: existingMasterPlanImage,
      });
      const nextLocationImage = resolveSingleImageUrl({
        file: getSingleFile(req.files, 'locationImageFile'),
        directUrl: locationImage,
        existingUrl: existingLocationImage,
      });
      const nextVideoUrl =
        toUploadUrl(getSingleFile(req.files, 'projectVideoFile')) ||
        normalizeString(videoUrl) ||
        null;
      const galleryImages = parseGalleryImages(req.body, req.files);
      const nearbyLocations = parseNearbyLocations(req.body);
      const paymentPlan = parsePaymentPlan(req.body);
      const insertId = normalizeString(id) || `prj_${Date.now()}`;

      connection = await getConnection();
      await connection.beginTransaction();

      await connection.execute(
        'INSERT INTO `Project` (id, title, location, type, status, description, details, imageUrl, projectLogoUrl, masterPlanImage, videoUrl, locationImage, locationMapUrl, brochureUrl, featured, amenities, specifications) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          insertId,
          title,
          location,
          type,
          status,
          description,
          details || null,
          projectImage,
          nextProjectLogoUrl,
          nextMasterPlanImage,
          nextVideoUrl,
          nextLocationImage,
          normalizeString(locationMapUrl) || null,
          normalizeString(brochureUrl) || null,
          parseBoolean(featured) ? 1 : 0,
          amenities || null,
          specifications || null,
        ],
      );

      await syncProjectRelations(connection, insertId, {
        galleryImages,
        nearbyLocations,
        paymentPlan,
      });

      await connection.commit();
      connection.release();
      connection = null;

      const createdProject = await fetchProjectById(insertId);
      res.status(201).json(createdProject);
    } catch (createError) {
      if (connection) {
        await connection.rollback();
        connection.release();
      }

      console.error('Error creating project:', createError);
      res.status(500).json({ error: 'Failed to create project' });
    }
  });
});

// Update project
router.put('/:id', (req, res) => {
  projectUpload(req, res, async (error) => {
    if (error) {
      return res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : 'Unable to process uploaded image',
      });
    }

    let connection;

    try {
      const {
        title,
        location,
        type,
        status,
        description,
        details,
        imageUrl,
        existingImageUrl,
        projectLogoUrl,
        existingProjectLogoUrl,
        masterPlanImage,
        existingMasterPlanImage,
        locationImage,
        existingLocationImage,
        locationMapUrl,
        brochureUrl,
        featured,
        amenities,
        specifications,
        videoUrl,
      } = req.body;

      const existingProjectRows = await query(
        'SELECT id, title, location, type, status, description, details, imageUrl, projectLogoUrl, masterPlanImage, videoUrl, locationImage, locationMapUrl, brochureUrl, featured, amenities, specifications FROM `Project` WHERE id = ? LIMIT 1',
        [req.params.id],
      );

      const existingProject = existingProjectRows[0];

      if (!existingProject) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const existingGalleryRows = await query(
        'SELECT imageUrl FROM `GalleryImage` WHERE projectId = ?',
        [req.params.id],
      );

      const nextProjectImage = resolveSingleImageUrl({
        file: getSingleFile(req.files, 'image'),
        directUrl: imageUrl,
        existingUrl: existingImageUrl || existingProject.imageUrl,
      });
      const nextProjectLogoUrl = resolveSingleImageUrl({
        file: getSingleFile(req.files, 'projectLogoFile'),
        directUrl: projectLogoUrl,
        existingUrl: existingProjectLogoUrl || existingProject.projectLogoUrl,
      });
      const nextMasterPlanImage = resolveSingleImageUrl({
        file: getSingleFile(req.files, 'masterPlanImageFile'),
        directUrl: masterPlanImage,
        existingUrl: existingMasterPlanImage || existingProject.masterPlanImage,
      });
      const nextLocationImage = resolveSingleImageUrl({
        file: getSingleFile(req.files, 'locationImageFile'),
        directUrl: locationImage,
        existingUrl: existingLocationImage || existingProject.locationImage,
      });
      const nextVideoUrl =
        toUploadUrl(getSingleFile(req.files, 'projectVideoFile')) ||
        normalizeString(videoUrl) ||
        existingProject.videoUrl ||
        null;
      const galleryImages = parseGalleryImages(req.body, req.files);
      const nearbyLocations = parseNearbyLocations(req.body);
      const paymentPlan = parsePaymentPlan(req.body);

      connection = await getConnection();
      await connection.beginTransaction();

      await connection.execute(
        'UPDATE `Project` SET title = ?, location = ?, type = ?, status = ?, description = ?, details = ?, imageUrl = ?, projectLogoUrl = ?, masterPlanImage = ?, videoUrl = ?, locationImage = ?, locationMapUrl = ?, brochureUrl = ?, featured = ?, amenities = ?, specifications = ? WHERE id = ?',
        [
          title,
          location,
          type,
          status,
          description,
          details || null,
          nextProjectImage,
          nextProjectLogoUrl,
          nextMasterPlanImage,
          nextVideoUrl,
          nextLocationImage,
          normalizeString(locationMapUrl) || null,
          normalizeString(brochureUrl) || null,
          parseBoolean(featured) ? 1 : 0,
          amenities || null,
          specifications || null,
          req.params.id,
        ],
      );

      await syncProjectRelations(connection, req.params.id, {
        galleryImages,
        nearbyLocations,
        paymentPlan,
      });

      await connection.commit();
      connection.release();
      connection = null;

      const removableImages = collectProjectImages(
        existingProject,
        existingGalleryRows,
      ).filter((imageUrlToCheck) => {
        const nextImages = collectProjectImages(
          {
            imageUrl: nextProjectImage,
            projectLogoUrl: nextProjectLogoUrl,
            videoUrl: nextVideoUrl,
            masterPlanImage: nextMasterPlanImage,
            locationImage: nextLocationImage,
          },
          galleryImages,
        );

        return !nextImages.includes(imageUrlToCheck);
      });

      await cleanupProjectImages(removableImages);

      const updatedProject = await fetchProjectById(req.params.id);
      res.json(updatedProject);
    } catch (updateError) {
      if (connection) {
        await connection.rollback();
        connection.release();
      }

      console.error('Error updating project:', updateError);
      res.status(500).json({ error: 'Failed to update project' });
    }
  });
});

// Delete project
router.delete('/:id', async (req, res) => {
  let connection;

  try {
    const existingProjectRows = await query(
      'SELECT imageUrl, projectLogoUrl, videoUrl, masterPlanImage, locationImage FROM `Project` WHERE id = ? LIMIT 1',
      [req.params.id],
    );

    const existingProject = existingProjectRows[0];

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const existingGalleryRows = await query(
      'SELECT imageUrl FROM `GalleryImage` WHERE projectId = ?',
      [req.params.id],
    );

    connection = await getConnection();
    await connection.beginTransaction();

    const [result] = await connection.execute(
      'DELETE FROM `Project` WHERE id = ?',
      [req.params.id],
    );

    await connection.commit();
    connection.release();
    connection = null;

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await cleanupProjectImages(
      collectProjectImages(existingProject, existingGalleryRows),
    );

    res.json({ message: 'Project deleted successfully' });
  } catch (deleteError) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }

    console.error('Error deleting project:', deleteError);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
